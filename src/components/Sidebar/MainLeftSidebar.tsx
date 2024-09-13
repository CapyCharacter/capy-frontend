"use client";

import { useState } from "react";
import Image from "next/image";
import { useMobileContext } from "../_common/MobileDetectionProvider";
import Button from "@/components/_common/Button";
import Link from "next/link";

import Sidebar from "./Sidebar";
import SidebarSection from "./SidebarSection";
import SidebarSubsection from "./SidebarSubsection";
import { useAuth, useSetAuth } from "../_common/AuthProvider";
import { useRouter } from "next/navigation";
import { callAuthLogout } from "@/utils/backend/callAuthLogout";
import { useGlobalContext } from "../_common/GlobalContextProvider";

interface EverySectionProps {
  closeSidebar: () => void;
};

// Section 1: Home Button
const HomeButton = ({ closeSidebar }: EverySectionProps) => (
  <div className="w-full py-4 px-6">
    <Link
      href="/"
      className="inline-block text-lg font-bold transition-colors duration-200 ease-in-out hover:bg-gray-50 px-2 py-1 rounded"
      onClick={closeSidebar}
    >
      CapyCharacter.AI
    </Link>
  </div>
);

// Section 2: Create Button
const CreateButton = ({ closeSidebar }: EverySectionProps) => {
  const submenuItems = [
    {
      label: "Character",
      icon: "/images/icons/new-character.svg",
      onClick: () => {
        closeSidebar();
      },
    },
    {
      label: "Voice",
      icon: "/images/icons/new-voice.svg",
      onClick: () => {
        closeSidebar();
      },
    },
  ];

  return (
    <div className="px-4 py-2">
      <Button
        label="Create"
        variant="primary"
        shape="capsule"
        icon="/images/icons/plus.svg"
        className="w-full"
        submenuItems={submenuItems}
        popupRelativeAlign="left_or_right"
        expandPopupMenuOnClick
        displayExpandPopupMenuIcon
      />
    </div>
  );
};

// Section 3: Discover Button
const DiscoverButton = ({ closeSidebar }: EverySectionProps) => {
  const router = useRouter();

  return (
    <div className="px-4 py-2">
      <Button
        label="Discover"
        variant="primary"
        icon="/images/icons/discover.svg"
        className="w-full"
        onClick={() => {
          closeSidebar();
          router.push('/');
        }}
      />
    </div>
  );
};

// Section 4: Suggested Conversations
const SuggestedConversations = ({ closeSidebar }: EverySectionProps) => {
  const auth = useAuth();

  return (
    auth.isAuthenticated ? (
      <div className="flex-grow overflow-y-auto">
        <SidebarSection title="Conversations">
          <SidebarSubsection title="Recent">
            <RecentCharacters closeSidebar={closeSidebar} />
          </SidebarSubsection>

          <SidebarSubsection title="This Week">
            <RecentCharacters closeSidebar={closeSidebar} />
          </SidebarSubsection>
        </SidebarSection>
      </div>
    ) : (
      <div className="flex-grow overflow-y-auto">
        <SidebarSection title="Conversations">
          <div className="px-4 text-gray-500">
            <Link href="/login" className="text-blue-500 hover:underline" onClick={closeSidebar}>
              Login
            </Link>
            {' to save your conversations and access more features.'}
          </div>
        </SidebarSection>
      </div>
    )
  );
};

// Section 5: Recent Characters
const RecentCharacters = ({ closeSidebar }: EverySectionProps) => {
  const characters = [
    { id: 1, name: "Character 1" },
    { id: 2, name: "Character 2" },
    { id: 3, name: "Character 3" },
  ];

  return (
    <div className="w-full px-4 py-2">
      {characters.map((char) => (
        <div key={char.id} className="mb-2 last:mb-0">
          <Button
            label={char.name}
            variant="void"
            icon="/images/fake-character-image.avif"
            className="w-full"
            roundIcon
            onClick={closeSidebar}
          />
        </div>
      ))}
    </div>
  );
};

// Section 6: User Profile
const UserProfile = ({ closeSidebar }: EverySectionProps) => {
  const router = useRouter();
  const auth = useAuth();
  const setAuth = useSetAuth();
  const { setJustLoggedOut } = useGlobalContext();

  const menuItems = [
    {
      label: "Profile",
      icon: "/images/icons/profile.svg",
      onClick: () => {
        closeSidebar();
      },
    },
    {
      label: "Setting",
      icon: "/images/icons/setting.svg",
      onClick: () => {
        closeSidebar();
      },
    },
    {
      label: "Logout",
      icon: "/images/icons/logout.svg",
      onClick: () => {
        closeSidebar();
        callAuthLogout().then(() => {
          setAuth({
            isAuthenticated: false,
          });
          setJustLoggedOut(true);
          router.push('/');
        });
      },
    },
  ];

  return (
    <div className="px-4 py-2">
      {auth.isAuthenticated ? (
        <Button
          label={auth.user.display_name}
          variant="primary"
          icon={auth.user.avatar_url || "/images/default-user-avatar.png"}
          className="w-full"
          submenuItems={menuItems}
          popupRelativeAlign="above_or_below"
          expandPopupMenuOnClick={true}
          displayExpandPopupMenuIcon={true}
          roundIcon={true}
        />
      ) : (
        <Button
          label="Login or Register"
          variant="primary"
          icon="/images/unauthenticated-user-avatar.png"
          className="w-full"
          roundIcon={true}
          onClick={() => {
            closeSidebar();
            router.push('/login');
          }}
        />
      )}
    </div>
  );
};

const MainLeftSidebar = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const isMobile = useMobileContext();

  const closeSidebar = () => {
    setIsLeftSidebarOpen(false);
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          className={`
            ${isMobile ? `fixed top-3 left-3` : `relative ml-5`}
            z-50 text-black p-2 rounded-lg
            transition-all duration-250 ease-in-out
            hover:scale-115 hover:bg-gray-200 hover:bg-opacity-50
            overflow-hidden
          `}
          style={{
            display: isLeftSidebarOpen ? "none" : "block",
          }}
        >
          <Image
            src="/images/icons/three-lines.svg"
            alt="Open Sidebar"
            width={32}
            height={32}
            className="relative z-10"
          />
        </button>
      )}

      <Sidebar
        isOpen={isLeftSidebarOpen}
        setIsOpen={setIsLeftSidebarOpen}
        position="left"
        toggleableOnMobile={true}
      >
        <HomeButton closeSidebar={closeSidebar} />
        <CreateButton closeSidebar={closeSidebar} />
        <DiscoverButton closeSidebar={closeSidebar} />
        <SuggestedConversations closeSidebar={closeSidebar} />
        <div className="mt-auto mb-4">
          <UserProfile closeSidebar={closeSidebar} />
        </div>
      </Sidebar>
    </>
  );
};

export default MainLeftSidebar;
