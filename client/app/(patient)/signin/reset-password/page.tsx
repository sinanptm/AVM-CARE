"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import CustomFormField from "@/components/common/CustomFormField";
import { FormFieldType } from "@/types/enum";
import SubmitButton from "@/components/button/SubmitButton";
import { useUpdatePassword } from "@/lib/hooks/patient/usePatientAuth";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/lib/hooks/useAuth";
import { notFound, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

const formSchema = z
   .object({
      newPassword: z
         .string()
         .trim()
         .min(6, "Password must be at least 6 characters long")
         .max(25, "Password must be at most 25 characters long")
         .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
         .regex(/[a-z]/, "Password must contain at least one lowercase letter")
         .regex(/[0-9]/, "Password must contain at least one number")
         .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
      confirmPassword: z.string(),
   })
   .superRefine(({ newPassword, confirmPassword }, ctx) => {
      if (newPassword !== confirmPassword) {
         ctx.addIssue({
            code: "custom",
            message: "The passwords do not match",
            path: ["confirmPassword"],
         });
      }
   });

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
   const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         newPassword: "",
         confirmPassword: "",
      },
   });
   const route = useRouter();
   const { mutate: updatePassword, isPending } = useUpdatePassword();
   const { control, handleSubmit } = form;
   const { resetMailPatient, setCredentials } = useAuth();
   const onSubmit = async (values: FormValues) => {
      updatePassword(
         {
            newPassword: values.newPassword,
            email: resetMailPatient,
         },
         {
            onSuccess: () => {
               toast({
                  title: "Password Updated ✅",
                  description: "Password Updated Successfully",
               });
               route.push("/signin");
               setTimeout(() => {
                  setCredentials("resetMailPatient", "");
               }, 2000);
            },
            onError: (error) => {
               toast({
                  title: "Updating Failed ❌",
                  description: error.response?.data.message || "Please try again later.",
                  variant: "destructive",
               });
            },
         }
      );
   };

   if (resetMailPatient) {
      return (
         <div className="container max-w-md mx-auto mt-48 remove-scrollbar">
            <Card>
               <CardHeader>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>Change your account password here.</CardDescription>
               </CardHeader>
               <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                     <CardContent className="space-y-4">
                        <CustomFormField
                           control={control}
                           fieldType={FormFieldType.PASSWORD}
                           name="newPassword"
                           placeholder="Your new password"
                           label="New Password"
                        />
                        <CustomFormField
                           control={control}
                           fieldType={FormFieldType.PASSWORD}
                           name="confirmPassword"
                           placeholder="Confirm your new password"
                           label="Confirm New Password"
                        />
                     </CardContent>
                     <CardFooter>
                        <SubmitButton isLoading={isPending} variant={"secondary"}>
                           Update Password
                        </SubmitButton>
                     </CardFooter>
                  </form>
               </Form>
            </Card>
         </div>
      );
   }

   notFound();
}
