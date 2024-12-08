import { FormEvent, useEffect, useState } from "react";
import background from "../assets/line.png";
import Logo from "../assets/sfoacc-logo.jpeg";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ApiSimulator } from "../utils/api-simulators";
import { Link, useNavigate } from "react-router-dom";
import { setPageTitle } from "../utils/seo";

interface LoginFormData {
  username: string;
  password: string;
}

export function Login(): JSX.Element {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    ApiSimulator(true, 2000)
      .then((data) => {
        console.log("data", formData, data);
        // redirect to "/dashboard"
        navigate("/dashboard");
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setPageTitle("Login");
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-background flex items-center overflow-hidden w-full">
        <div className="min-h-screen basis-full flex flex-wrap w-full justify-center overflow-y-auto">
          <div
            className="basis-1/2 bg-primary w-full relative hidden xl:flex justify-center items-center bg-gradient-to-br 
            from-primary-600 via-primary-400 to-primary-600"
          >
            <img
              src={background}
              alt="image"
              className="absolute top-0 left-0 w-full h-full"
            />

            <div className="flex flex-col justify-center items-center">
              <img src={Logo} className="h-64 w-64" alt="logo" />

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

          <div className="min-h-screen basis-full md:basis-1/2 w-full px-4 py-5 flex justify-center items-center border">
            <div className="w-full lg:w-[460px]">
              <div className="border mb-8 xl:hidden flex flex-col justify-center items-center">
                <img src={Logo} className="h-[7rem] w-[7rem]" alt="logo" />
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
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="username"
                    className="font-medium text-default-600"
                  >
                    Email
                  </label>
                  <Input
                    id="username"
                    name="username"
                    className="mt-2"
                    type="email"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    aria-label="Email address"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="font-medium text-default-600"
                  >
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    className="mt-2"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    aria-label="Password"
                  />
                </div>

                <div className=" flex flex-wrap gap-2">
                  <div className="flex-1 flex  items-center gap-1.5 ">
                    <div className="flex justify-center items-center">
                      <input
                        type="checkbox"
                        className="border-default-300 mt-[1px] cursor-pointer "
                      />
                      <label
                        htmlFor="isRemebered"
                        className="text-sm text-default-600 cursor-pointer whitespace-nowrap ml-1.5"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <Link
                    to="/auth/forgot"
                    className="flex-none text-sm text-primary"
                  >
                    Forget Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="mt-4"
                  aria-busy={isLoading}
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
