import { useState } from "react";
import { signupUser } from "./api";

export function useSignUp(onSignUpSuccess) {
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");

  const handleSignUp = async (name, email, password, username) => {
    setSignUpLoading(true);
    setSignUpError("");
    setSignUpSuccess("");
    try {
      await signupUser(name, email, password, username);
      setSignUpSuccess("Account created! You can now sign in.");
      if (onSignUpSuccess) onSignUpSuccess();
    } catch (err) {
      setSignUpError(err.toString());
    } finally {
      setSignUpLoading(false);
    }
  };

  return { handleSignUp, signUpLoading, signUpError, signUpSuccess };
}
