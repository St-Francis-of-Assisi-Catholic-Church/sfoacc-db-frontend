import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

enum MODE {
  DARK = "dark",
  LIGHT = "light",
}

export const siteConfig = {
  title: "SFOACC ",
  description: `A Church Database Management Platform`,
  //   logo: logoImg,
  //   icon: logoIconImg,
  mode: MODE.LIGHT,
  // TODO: favicon
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  return {
    title: title ? `SFOACC - ${title}` : siteConfig.title,
    description,
  };
};
