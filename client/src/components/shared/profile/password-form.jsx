import React, { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import axios from "../../../api/axios";

export const UpdatePasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = (event) => setShowPassword(event.target.checked);

  const handleOnFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (data?.newPassword?.trim() === "") {
      alert(
        "Please fill up the required fields to conitnue changing password!"
      );
      return;
    }
    if (data?.newPassword !== data?.confirmPassword) {
      alert("New password must be equal to your confirm password!");
      return;
    }

    const token = localStorage.getItem("__tmutoken");

    try {
      await axios.patch("/api/user/update/password", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      window.location.reload();
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
    }
  };

  return (
    <form onSubmit={handleOnFormSubmit} className="w-full">
      <Label htmlFor="UPDATE_CURRENT_PASSWORD">Old Password</Label>
      <Input
        type={showPassword ? "text" : "password"}
        name="oldPassword"
        id="UPDATE_CURRENT_PASSWORD"
        placeholder="Enter your full name"
        required
        className="w-full mb-4"
      />
      <Label htmlFor="UPDATE_NEW_PASSWORD">Create New Password</Label>
      <Input
        type={showPassword ? "text" : "password"}
        name="newPassword"
        id="UPDATE_NEW_PASSWORD"
        placeholder="Enter your email address"
        required
        className="w-full mb-4"
      />
      <Label htmlFor="UPDATE_CONFIRM_PASSWORD">Confirm New Password</Label>
      <Input
        type={showPassword ? "text" : "password"}
        name="confirmPassword"
        id="UPDATE_CONFIRM_PASSWORD"
        placeholder="Create your username"
        required
        className="w-full mb-4"
      />
      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          name="showPassword"
          id="UPDATE_SHOW_PASSWORD"
          checked={showPassword}
          onChange={handleShowPassword}
          className="w-4 h-4 accent-zinc-900 dark:accent-white"
        />
        <Label htmlFor="UPDATE_SHOW_PASSWORD" className="mb-0">
          {showPassword ? "Hide" : "Show"} password
        </Label>
      </div>
      <Button type="submit" size="large">
        Change Password
      </Button>
    </form>
  );
};
