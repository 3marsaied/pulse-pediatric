"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { WavyBackground } from '@/components/ui/wavy-background';
import { IconBrandGoogle } from "@tabler/icons-react";
import { CircularProgress } from '@mui/material';
import Link from 'next/link';
const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
    </>
  );
};
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
const login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(formData),
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_NAME}/login`, requestOptions);
      const data = await response.json();
      // Mock server
      // localStorage.setItem("accessToken", formData.username)
      // localStorage.setItem("userId", "1")
      // localStorage.setItem("role", "doctor")
      console.log(data)

      if (response.status === 200 || response.status === 201) {
        setLoading(false)
        // back end server
        localStorage.setItem("accessToken", data[0].accessToken)
        localStorage.setItem("userId", data[0].userId)
        localStorage.setItem("role", data[0].role)

        if (localStorage.getItem("role") === "doctor") {
          router.push(`/Home/DoctorPortal/${localStorage.getItem('userId')}`)
        }
        else if (localStorage.getItem("role") === "customer") {
          router.push(`/Home/PatientPortal/${localStorage.getItem('userId')}`)
        }
        else if (localStorage.getItem("role") === "staff") {
          router.push(`/Home/StaffPortal/${localStorage.getItem('userId')}`)
        }
        else if (localStorage.getItem("role") === "admin") {
          router.push(`/Home/AdminPanel/${localStorage.getItem('userId')}`)
        }
      }
      else {
        setLoading(false)
      }
    }
    catch (error) {
      console.error('Error loggin in:', error)
      setLoading(false)
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <WavyBackground className="max-w-4xl h-screen mx-auto flex justify-self-center" backgroundFill="#f3f4f6" colors={["#ffedd5", "#fed7aa", "#fdba74", "#fb923c", "#f97316"]}>
      <div className="max-w-md w-full min-w-[28rem] mx-auto my-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to <span className="text-orange-500">Pulse Clinic</span>
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Login to go to your portal
        </p>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="username">User Name</Label>
            <Input id="username" name='username' value={formData.username} onChange={handleChange} required placeholder="" type="username" />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="" type="password" />
          </LabelInputContainer>
          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={loading ? true : false}
          >
            {loading ? <CircularProgress color="warning" size={"1.3rem"} /> : <p>Log in &rarr;</p>}
            <BottomGradient />
          </button>

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
          <button
            className="justify-center relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Login with Google
            </span>
            <BottomGradient />
          </button>
          <div className="flex flex-col space-y-4 mt-4">
            <Link href="/Signup">
              <button
                className="justify-center relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                type="submit"
              >
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Create an account
                </span>
                <BottomGradient />
              </button>
            </Link>
          </div>
        </form>
      </div>
    </WavyBackground>
  )
}

export default login