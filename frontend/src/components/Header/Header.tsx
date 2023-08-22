"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/ui/navigation-menu";
import Link from "next/link";
import { Button } from "@/ui/button";
import { MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/ui/dropdown-menu";
import { useMe } from "@/hooks/useMe";
import { useRouter } from "next/navigation";

const Header = () => {
  const { meQuery } = useMe();
  const router = useRouter();
  return (
    <div className="p-5 flex justify-between items-center border-b border-border">
      <h1 className="text-2xl cursor-pointer" onClick={() => router.push("/")}>
        MrK CMS
      </h1>
      <section className="hidden md:block">
        <NavigationMenu>
          <NavigationMenuList className="gap-3">
            <NavigationMenuItem>
              <Link href="/all-posts" className={navigationMenuTriggerStyle()}>
                All Posts
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/write" className={navigationMenuTriggerStyle()}>
                New Post
              </Link>
            </NavigationMenuItem>
            {meQuery.data ? (
              <NavigationMenuItem>
                <Link href="/profile" className={navigationMenuTriggerStyle()}>
                  My Profile
                </Link>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <Link href="/login" className={navigationMenuTriggerStyle()}>
                  Login
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </section>
      <section className="block md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="p-3 border border-boder rounded-md">
              <MenuIcon size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <Link href="/all-posts">
                <DropdownMenuItem>All Posts</DropdownMenuItem>
              </Link>
              <Link href="/write">
                <DropdownMenuItem>New Post</DropdownMenuItem>
              </Link>
              {meQuery.data ? (
                <Link href="/profile">
                  <DropdownMenuItem>My Profile</DropdownMenuItem>
                </Link>
              ) : (
                <Link href="/login">
                  <DropdownMenuItem>Login</DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </div>
  );
};

export default Header;
