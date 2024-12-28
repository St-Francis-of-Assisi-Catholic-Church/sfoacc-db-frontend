"use server";
import { signOut } from "@/auth";

const handleSignOut = async () => {
  console.log("clcikmee");
  //  Server side log out

  // clear client side session
  await signOut();
};

export default handleSignOut;
