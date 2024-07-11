"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Loading } from "./Loading";

export const NavigationBar = () => {
  const firstRouter = `/${usePathname().split("/")[1]}`;

  if (!firstRouter) return <Loading />;
  if (firstRouter === "/signin") return null;

  return (
    <div className="w-40 h-screen fixed top-0 left-0 bg-default flex flex-col justify-center items-end space-y-10 rounded-r-3xl">
      {icons.map((iconClass) => (
        <Link
          key={iconClass.href}
          href={iconClass.href}
          className={`w-11/12 h-24 ${
            firstRouter === iconClass.href ? "bg-white" : "bg-default"
          } rounded-l-3xl flex flex-col justify-center items-center`}
        >
          <span
            className={`${iconClass.icon} ${
              firstRouter === iconClass.href ? "text-default" : "text-white"
            } text-5xl mr-3`}
          ></span>
        </Link>
      ))}
    </div>
  );
};

const icons = [
  { href: "/home", icon: "icon-[iconamoon--home]" },
  { href: "/board", icon: "icon-[mingcute--menu-line]" },
  { href: "/circle", icon: "icon-[ep--setting]" },
];
