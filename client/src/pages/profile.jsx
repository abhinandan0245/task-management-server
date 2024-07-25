import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Container } from "../components/ui/container";
import { UpdateProfileForm } from "../components/shared/profile/update-form";
import { UpdatePasswordForm } from "../components/shared/profile/password-form";
import {
  Card,
  CardBody,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import axios from "../api/axios";
import { useEffect, useState } from "react";

export const Profile = () => {
  const [userDetails, setUserdetails] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const handleFetchUserDetails = async (signal) => {
    const token = localStorage.getItem("__tmutoken");

    if (token) {
      try {
        const response = await axios.get("/api/user/details", {
          signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        setUserdetails(response?.data?.user);
      } catch (error) {
        alert(error?.response?.data?.message || error?.message);

        localStorage.clear();
        window.location.reload();
      }
    } else {
      localStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    handleFetchUserDetails(abortController.signal);

    return () => abortController.abort();
  }, [isUpdate]);

  return (
    <main className="h-full overflow-y-auto">
      <section className="py-6">
        <Container>
          <div className="py-2 flex items-center gap-1 mb-6 border-b border-b-zinc-200">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
            <h1 className="text-base font-semibold dark:font-medium">
              Manage your profile
            </h1>
          </div>
          <div className="flex flex-col gap-8">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Update Profile Details</CardTitle>
                <CardDescription>
                  Please fill out the required fields to continue
                </CardDescription>
              </CardHeader>
              <CardBody className="mb-0">
                <UpdateProfileForm
                  userDetails={userDetails}
                  setIsUpdate={setIsUpdate}
                />
              </CardBody>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Please enter your old and new password to continue
                </CardDescription>
              </CardHeader>
              <CardBody className="mb-0">
                <UpdatePasswordForm />
              </CardBody>
            </Card>
          </div>
        </Container>
      </section>
    </main>
  );
};
