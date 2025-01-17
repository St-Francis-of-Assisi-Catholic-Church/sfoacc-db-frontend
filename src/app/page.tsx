import LoginForm from "@/components/forms/login";
import { metaObject } from "@/config/site.config";

import Image from "next/image";

import background from "../../public/line.png";
import Logo from "../../public/sfoacc-logo.png";

export const metadata = {
  ...metaObject("Login"),
};

export default function Home() {
  return (
    <div>
      <div className="min-h-screen bg-background flex items-center overflow-hidden w-full">
        <div className="min-h-screen basis-full flex flex-wrap w-full justify-center overflow-y-auto ">
          <div
            className="basis-1/2 bg-primary w-full relative hidden xl:flex justify-center items-center bg-gradient-to-br 
            from-primary-600 via-primary-400 to-primary-600"
          >
            <Image
              src={background}
              alt="image"
              className="absolute top-0 left-0 w-full h-full"
              priority
            />

            <div className="flex flex-col justify-center items-center">
              <Image src={Logo} className="h-64 w-64" alt="logo" priority />

              <div className="mt-10 text-white font-medium text-center flex flex-col gap-2">
                <h1 className="text-2xl">
                  Church Database Management Platform
                </h1>
                <h2 className="text-xl">
                  St. Francis of Assisi Catholic Church
                </h2>
                <h3 className="text-xl">Ashaley Botwe, Accra</h3>
              </div>
            </div>
          </div>

          <div className="min-h-screen basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center ">
            <div className="w-full lg:w-[460px]">
              <div className=" mb-8 xl:hidden flex flex-col justify-center items-center">
                <Image
                  src={Logo}
                  className="h-[7rem] w-[7rem]"
                  alt="logo"
                  priority
                />
                <div className="mt-2 text- font-medium text-center flex flex-col gap-0.5">
                  <h1 className="text-md font-semibold">
                    Church Database Management Platform
                  </h1>
                  <h2 className="text-md">
                    St. Francis of Assisi Catholic Church
                  </h2>
                  <h3 className="text-md">Ashaley Botwe, Accra</h3>
                </div>
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
