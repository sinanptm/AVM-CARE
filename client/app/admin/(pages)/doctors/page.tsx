import DoctorTable from "@/components/view/table/DoctorsTable";
import { DoctorsFilter } from "@/types/enum";
import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Doctors",
};

const Page = ({ searchParams }: { searchParams: { page: number; type: DoctorsFilter } }) => {
   const page = searchParams.page || 1;
   const type = searchParams.type || DoctorsFilter.VERIFIED;

   return <DoctorTable page={page} type={type} />;
};

export default Page;
