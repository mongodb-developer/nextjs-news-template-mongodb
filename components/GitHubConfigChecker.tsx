"use client";

import { useEffect } from "react";
import { checkGitHubConfig, showGitHubConfigError } from "@/lib/github-config";

export function GitHubConfigChecker() {
  useEffect(() => {
    const checkConfig = async () => {
      const isConfigured = await checkGitHubConfig();
      if (!isConfigured) {
        showGitHubConfigError();
      }
    };

    checkConfig();
  }, []);

  return null;
}