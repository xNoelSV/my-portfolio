import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
};

module.exports = withContentlayer(nextConfig);
