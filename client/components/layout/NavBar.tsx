"use client";

import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { NavLinks } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useLogoutMutation } from "@/lib/hooks/patient/usePatientAuth";
import { toast } from "../ui/use-toast";
import { useState } from "react";
import LogoutModel from "../models/LogoutModel";
import { ButtonV2 } from "../button/ButtonV2";
import NotificationButtonPatient from "../button/NotificationButtonPatient";
import VideoSectionButtonPatient from "../button/VideoSectionButtonPatient";

export const NavBar = () => {
  const path = usePathname();
  const route = useRouter();
  const { mutate: logoutFunc } = useLogoutMutation();
  const { patientToken, setCredentials, logout } = useAuth();
  const [isLogoutModelOpen, setLogoutModelOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isAuthorized = !!patientToken;

  if (path.includes("signup") || path.includes("admin") || path.includes("signin") || path.includes("doctor")) {
    return null;
  }

  const handleLogoutClick = () => {
    setLogoutModelOpen(true);
  };

  const handleLogoutConfirm = () => {
    try {
      logoutFunc(null, {
        onSuccess: () => {
          toast({
            title: "Logout Successful",
            description: "We hope to see you again soon!",
            variant: "info",
          });
          setCredentials("patientToken", "");
          route.push("/");
        },
        onError: () => {
          toast({
            title: "Logout Failed",
            description: "An error occurred during logout. Please try again.",
            variant: "destructive",
          });
          logout("patientToken");
        },
      });
      setLogoutModelOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLinkHome = () => {
    setIsSheetOpen(false);
  };

  const handleLinkClick = (link: string) => {
    route.push(link);
    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-dark-300 bg-opacity-55 px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base" prefetch={false}>
          <Image
            width={23}
            height={23}
            onClick={handleLinkHome}
            src={'/assets/icons/logo-icon.svg'}
            alt="AVM"
            className="h-6 w-6"
          />
          <span className="sr-only">Acme Inc</span>
        </Link>
        {NavLinks.map((link) => (
          <ButtonV2
            variant={"linkHover2"}
            onClick={() => handleLinkClick(link.href)}
            size={"sm"}
            key={link.label + link.href}
          >
            {link.label}
          </ButtonV2>
        ))}
      </nav>
      <Sheet modal open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Image src={"/assets/icons/menu.svg"} alt="Menu" width={30} height={30} className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetDescription></SheetDescription>
          <SheetTitle>
            <span className="sr-only">Navigation Menu</span>
          </SheetTitle>
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
              <Image
                src={"/assets/icons/logo-icon.svg"}
                width={33}
                height={33}
                alt="Logo"
                className="h-11 w-11"
              />
              <span className="sr-only">Acme Inc</span>
            </Link>
            {NavLinks.map((link) => (
              <Link
                href={link.href}
                key={link.label + link.href}
                onClick={handleLinkHome}
                className="text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-4">
        <VideoSectionButtonPatient />
        <NotificationButtonPatient />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonV2 variant="ghost" size="icon" className="rounded-full">
              <Image
                src="/assets/icons/circle-user.svg"
                width={30}
                height={30}
                className="rounded-full"
                alt="Avatar"
              />
              <span className="sr-only">Toggle user menu</span>
            </ButtonV2>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-3 bg-dark-200">
            {isAuthorized ? (
              <>
                <DropdownMenuLabel className="cursor-pointer">
                  <Link href={"/profile"}>My Account</Link>
                </DropdownMenuLabel>
                <DropdownMenuLabel className="cursor-pointer">
                  <Link href={"/appointments"}>Appointments</Link>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onSelect={handleLogoutClick}>
                  Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem className="cursor-pointer bg-dark-200" onClick={() => route.push("/signin")}>
                  <Link href={"/signin"}>Sign In</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <LogoutModel
          open={isLogoutModelOpen}
          setOpen={setLogoutModelOpen}
          handleLogoutConfirm={handleLogoutConfirm}
        />
      </div>
    </header>
  );
};

export default NavBar;
