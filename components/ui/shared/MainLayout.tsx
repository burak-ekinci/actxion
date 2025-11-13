"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  Cog6ToothIcon,
  EnvelopeIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon,
  PlusIcon,
  UserCircleIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import {
  User,
  Bolt,
  Wallet,
  Gem,
  LayoutDashboard,
  Plus,
  TableOfContents,
  CheckCircle,
  BadgeDollarSign,
  Check,
  DollarSign,
  Gauge,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Spinner from "./SpinnerLittle";
import { useAccount } from "wagmi";
import { useWeb3Store } from "@/store/web3Store";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const getNavigation = () => {
  const baseNav = [
    {
      name: "Discover",
      href: "/discover",
      icon: HomeIcon,
      current: true,
    },
    {
      name: "Leaderboard",
      href: "/leaderboard", // Ana menüye tıklanınca buraya gider
      icon: TrophyIcon,
      current: false,
    },
    {
      name: "ACTXION NFTs",
      href: "/nfts", // Ana menüye tıklanınca buraya gider
      icon: Gem,
      current: false,
    },
    {
      name: "ACTXION Wallet",
      href: "/myaccount",
      icon: Wallet,
      current: false,
    },
    {
      name: "Advertiser",
      href: "/advertiser", // Ana menüye tıklanınca buraya gider
      icon: LayoutDashboard,
      current: false,
      children: [
        {
          name: "Advertiser Dashboard",
          href: "/advertiser",
          icon: Gauge,
        },
        {
          name: "Create Campaign",
          href: "/advertiser/create",
          icon: Plus,
        },
        {
          name: "View Campaigns",
          href: "/advertiser/mycampaigns",
          icon: TableOfContents,
        },
        {
          name: "Review Submissions",
          href: "/advertiser/submissions",
          icon: Check,
        },
        {
          name: "Manage Payouts",
          href: "/advertiser/payouts",
          icon: DollarSign,
        },
      ],
    },
  ];

  // Settings sadece superadmin için
  //   if (isSuperadmin) {
  //     baseNav.push({
  //         name: "Settings",
  //       href: "/settings",
  //       icon: Cog6ToothIcon,
  //       current: false,
  //     });
  //   }

  // Diğer menüler herkese açık
  baseNav.push();

  return baseNav;
};

const getUserNavigation = () => [
  { name: "Profile", href: "/profile" },
  { name: "Sign Out", href: "/login" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function AppSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const { address } = useAccount();
  const { actions } = useWeb3Store();
  const router = useRouter();
  const { data: session } = useSession();
  // Hydration hatasını önlemek için
  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = getNavigation();
  const userNavigation = getUserNavigation();

  const handleToggleMenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // boşluk(space) tuşuna basılınca searchbar açılsın ancak herhangi bir inputta focus olduğunda açılmasın
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === " ") {
        if (
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA" &&
          document.activeElement?.tagName !== "SELECT" &&
          document.activeElement?.tagName !== "BUTTON"
        ) {
          setSearchOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // SSR sırasında ve i18n yüklenmeden önce loading göster
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* ============= Mobile Sidebar ============= */}
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>

              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-20 shrink-0 items-center justify-center">
                  <Image
                    alt="ACTXION Logo"
                    src="/actxion-logo.png"
                    className="h-16 w-auto"
                    width={160}
                    height={48}
                    loading="eager"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgMTIwIDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo="
                  />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => {
                      const isActive = item.href
                        ? pathname === item.href
                        : item.children?.some(
                            (child: any) => pathname === child.href
                          );

                      const isOpen = openMenus[item.name] || false;

                      return (
                        <li key={item.name}>
                          {item.children ? (
                            <>
                              <div
                                className={classNames(
                                  isActive
                                    ? "bg-gray-50 text-indigo-600"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                  "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer items-center justify-between"
                                )}
                                onClick={() => handleToggleMenu(item.name)}
                              >
                                <span className="flex items-center gap-x-3">
                                  <item.icon
                                    aria-hidden="true"
                                    className={classNames(
                                      isActive
                                        ? "text-indigo-600"
                                        : "text-gray-400 group-hover:text-indigo-600",
                                      "size-6 shrink-0"
                                    )}
                                  />
                                  {item.name}
                                </span>
                                <ChevronDownIcon
                                  className={classNames(
                                    "size-5 transition-transform duration-200",
                                    isOpen ? "rotate-180" : ""
                                  )}
                                  aria-hidden="true"
                                />
                              </div>
                              {isOpen && (
                                <ul className="ml-8 space-y-1">
                                  {item.children.map((child: any) => {
                                    const isChildActive =
                                      pathname === child.href;
                                    return (
                                      <li key={child.name}>
                                        <Link
                                          href={child.href}
                                          onClick={() => setSidebarOpen(false)}
                                          className={classNames(
                                            isChildActive
                                              ? "bg-gray-100 text-indigo-600"
                                              : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600",
                                            "flex items-center gap-x-2 rounded-md p-2 text-sm/6 font-normal"
                                          )}
                                        >
                                          {child.icon && (
                                            <child.icon
                                              className="size-5 shrink-0"
                                              aria-hidden="true"
                                            />
                                          )}
                                          {child.name}
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              )}
                            </>
                          ) : (
                            <Link
                              href={item.href}
                              onClick={() => setSidebarOpen(false)}
                              className={classNames(
                                isActive
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  isActive
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-indigo-600",
                                  "size-6 shrink-0"
                                )}
                              />
                              {item.name}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* ============= Desktop Sidebar ============= */}
        <div
          className={classNames(
            "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ease-in-out",
            desktopSidebarOpen ? "lg:w-64" : "lg:w-16"
          )}
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div
            className={classNames(
              "flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white pb-4 transition-all duration-300 ease-in-out",
              desktopSidebarOpen ? "px-6" : "px-2"
            )}
          >
            <div className="flex h-27 shrink-0 items-center justify-center relative">
              {desktopSidebarOpen ? (
                <Link href="/dashboard">
                  <Image
                    alt="ACTXIO Logo"
                    src="/actxion-logo.png"
                    className="h-18 w-auto"
                    width={180}
                    height={48}
                    loading="eager"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgMTIwIDQ4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo="
                  />
                </Link>
              ) : (
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Bars3Icon className="h-5 w-5 text-indigo-600" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
                className={classNames(
                  "absolute z-99 top-6/6 transform -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:bg-gray-50 transition-colors duration-200",
                  desktopSidebarOpen ? "" : "rotate-180"
                )}
              >
                <ChevronDownIcon
                  className="h-4 w-4 text-gray-500 transform rotate-90"
                  aria-hidden="true"
                />
              </button>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = item.href
                    ? pathname === item.href
                    : item.children?.some(
                        (child: any) => pathname === child.href
                      );

                  const isOpen = openMenus[item.name] || false;

                  return (
                    <li key={item.name}>
                      {item.children ? (
                        <>
                          {!desktopSidebarOpen ? (
                            <Link
                              href={item.href}
                              className={classNames(
                                isActive
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex rounded-md p-2 text-sm/6 font-semibold cursor-pointer items-center relative justify-center"
                              )}
                              title={item.name}
                            >
                              <item.icon
                                aria-hidden="true"
                                className={classNames(
                                  isActive
                                    ? "text-indigo-600"
                                    : "text-gray-400 group-hover:text-indigo-600",
                                  "size-6 shrink-0"
                                )}
                              />
                            </Link>
                          ) : (
                            <div
                              className={classNames(
                                isActive
                                  ? "bg-gray-50 text-indigo-600"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                "group flex rounded-md p-2 text-sm/6 font-semibold cursor-pointer items-center relative gap-x-3 justify-between"
                              )}
                              onClick={() => handleToggleMenu(item.name)}
                            >
                              <span className="flex items-center gap-x-3">
                                <item.icon
                                  aria-hidden="true"
                                  className={classNames(
                                    isActive
                                      ? "text-indigo-600"
                                      : "text-gray-400 group-hover:text-indigo-600",
                                    "size-6 shrink-0"
                                  )}
                                />
                                {item.name}
                              </span>
                              <ChevronDownIcon
                                className={classNames(
                                  "size-5 transition-transform duration-200",
                                  isOpen ? "rotate-180" : ""
                                )}
                                aria-hidden="true"
                              />
                            </div>
                          )}
                          {isOpen && desktopSidebarOpen && (
                            <ul className="ml-8 space-y-1">
                              {item.children.map((child: any) => {
                                const isChildActive = pathname === child.href;
                                return (
                                  <li key={child.name as string}>
                                    <Link
                                      href={child.href as string}
                                      className={classNames(
                                        isChildActive
                                          ? "bg-gray-100 text-indigo-600"
                                          : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600",
                                        "flex items-center gap-x-2 rounded-md p-2 text-sm/6 font-normal"
                                      )}
                                    >
                                      {child.icon && (
                                        <child.icon
                                          className="size-5 shrink-0"
                                          aria-hidden="true"
                                        />
                                      )}
                                      {child.name}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className={classNames(
                            isActive
                              ? "bg-gray-50 text-indigo-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                            "group flex rounded-md p-2 text-sm/6 font-semibold",
                            desktopSidebarOpen ? "gap-x-3" : "justify-center"
                          )}
                          title={!desktopSidebarOpen ? item.name : undefined}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              isActive
                                ? "text-indigo-600"
                                : "text-gray-400 group-hover:text-indigo-600",
                              "size-6 shrink-0"
                            )}
                          />
                          {desktopSidebarOpen && item.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* ============= Main Content ============= */}
        <div
          className={classNames(
            "transition-all duration-300 ease-in-out",
            desktopSidebarOpen ? "lg:pl-64" : "lg:pl-16"
          )}
        >
          <div className="sticky top-0 z-40 w-full">
            <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 w-full">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Separator */}
              <div
                aria-hidden="true"
                className="h-6 w-px bg-gray-200 lg:hidden"
              />

              <div className="flex flex-1 items-center justify-between gap-x-4 self-stretch lg:gap-x-6">
                {/* <form
                  action="#"
                  method="GET"
                  className="grid flex-1 grid-cols-1"
                >
                  <input
                    name="search"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
                  />
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                  />
                </form> */}
                <button
                  type="button"
                  className="p-2.5 text-gray-400 hover:text-gray-500 flex items-center gap-x-2 text-sm"
                  onClick={() => setSearchOpen(true)}
                >
                  <MagnifyingGlassIcon aria-hidden="true" className="size-5" />{" "}
                  Search
                </button>

                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  {/* <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="size-6" />
                  </button> */}

                  {/* Separator */}
                  <div
                    aria-hidden="true"
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                  />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <MenuButton className="relative flex items-center">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <UserCircleIcon
                        aria-hidden="true"
                        className="size-8 rounded-full text-indigo-500"
                      />
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          aria-hidden="true"
                          className="ml-4 text-sm/6 font-semibold text-gray-900"
                        >
                          {address
                            ? address.slice(0, 6) + "..." + address.slice(-6)
                            : session?.user?.email || "User"}
                        </span>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="ml-2 size-5 text-gray-400"
                        />
                      </span>
                    </MenuButton>

                    <MenuItems
                      transition
                      className="absolute right-0 z-10 mt-2.5 w-36 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition data-closed:scale-95 data-closed:opacity-0"
                    >
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          {({ active }) =>
                            item.name === "Sign Out" ? (
                              <button
                                type="button"
                                onClick={() => {
                                  signOut({ callbackUrl: "/login" });
                                }}
                                className={`block w-full px-3 py-1 text-left text-sm/6 ${
                                  active
                                    ? "bg-gray-50 text-indigo-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {item.name}
                              </button>
                            ) : (
                              <Link
                                href={item.href}
                                className={`block px-3 py-1 text-sm/6 ${
                                  active
                                    ? "bg-gray-50 text-indigo-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {item.name}
                              </Link>
                            )
                          }
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <main className="py-3">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
