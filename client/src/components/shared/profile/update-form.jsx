import React, { useEffect, useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import axios from "../../../api/axios";

export const UpdateProfileForm = ({ userDetails, setIsUpdate }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (userDetails && !data) {
      setData({
        name: userDetails?.name,
        email: userDetails?.email,
        username: userDetails?.username,
      });
    }
  }, [userDetails]);

  const handleOnInputChange = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOnFormSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("__tmutoken");

    if (!token) {
      alert("Session expired, please login again to conitnue!");

      localStorage.clear();
      window.location.reload();
    }

    if (!data?.name || !data?.email || !data?.username) {
      alert("Please fill up the required fields to continue!");
      return;
    }

    try {
      await axios.patch("/api/user/update", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setData(null);
      setIsUpdate((prev) => !prev);
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
    }
  };

  return (
    <form onSubmit={handleOnFormSubmit} className="w-full">
      <Label htmlFor="UPDATE_PROFILE_NAME">Full Name</Label>
      <Input
        type="text"
        name="name"
        id="UPDATE_PROFILE_NAME"
        placeholder="Enter your full name"
        value={data?.name ?? ""}
        onChange={handleOnInputChange}
        required
        className="w-full mb-4"
      />
      <Label htmlFor="UPDATE_PROFILE_EMAIL">Email Address</Label>
      <Input
        type="email"
        name="email"
        id="UPDATE_PROFILE_EMAIL"
        placeholder="Enter your email address"
        value={data?.email ?? ""}
        onChange={handleOnInputChange}
        required
        className="w-full mb-4"
      />
      <Label htmlFor="UPDATE_PROFILE_USERNAME">Username</Label>
      <Input
        type="text"
        name="username"
        id="UPDATE_PROFILE_USERNAME"
        placeholder="Create your username"
        value={data?.username ?? ""}
        onChange={handleOnInputChange}
        required
        className="w-full mb-4"
      />
      <Button
        type="submit"
        size="large"
        disabled={
          userDetails?.name === data?.name &&
          userDetails?.email === data?.email &&
          userDetails?.username === data?.username
        }
      >
        Save Changes
      </Button>
    </form>
  );
};
