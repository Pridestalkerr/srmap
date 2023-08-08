"use client";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";

const Dropzone = () => {
  const uploadMutation = useMutation((file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }, {
    onMutate: async (file) => {
        await queryClient.cancel
    }
  });

  const { handleSubmit, control } = useForm();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }, []);
};
