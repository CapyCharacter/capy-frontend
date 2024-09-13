"use client";

import { useState } from "react";
import Image from "next/image";
import { useMobileContext } from "../_common/MobileDetectionProvider";
import Button from "@/components/_common/Button";
import Link from "next/link";

import Sidebar from "./Sidebar";
import SidebarSection from "./SidebarSection";
import SidebarSubsection from "./SidebarSubsection";

// Section 1: Home Button
const HomeButton = () => (
  <div className="w-full py-4 px-6">
    <Link
      href="/"
      className="inline-block text-lg font-bold transition-colors duration-200 ease-in-out hover:bg-gray-50 px-2 py-1 rounded"
    >
      CapyCharacter.AI
    </Link>
  </div>
);

// Section 2: Create Button
const CreateButton = () => {
  const submenuItems = [
    {
      label: "Character",
      icon: "/images/icons/new-character.svg",
      onClick: () => {},
    },
    { label: "Voice", icon: "/images/icons/new-voice.svg", onClick: () => {} },
  ];

  return (
    <div className="px-4 py-2">
      <Button
        label="Create"
        variant="secondary"
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
const DiscoverButton = () => (
  <div className="px-4 py-2">
    <Button
      label="Discover"
      variant="secondary"
      icon="/images/icons/discover.svg"
      className="w-full"
    />
  </div>
);

// Section 4: Recent Characters
const RecentCharacters = () => {
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
          />
        </div>
      ))}
    </div>
  );
};

// Section 5: User Profile
const UserProfile = () => {
  const menuItems = [
    { label: "Profile", icon: "/images/icons/profile.svg", onClick: () => {} },
    { label: "Setting", icon: "/images/icons/setting.svg", onClick: () => {} },
    { label: "Logout", icon: "/images/icons/logout.svg", onClick: () => {} },
  ];

  return (
    <div className="px-4 py-2">
      <Button
        label="Username"
        variant="secondary"
        icon="/images/fake-character-image.avif"
        className="w-full"
        submenuItems={menuItems}
        popupRelativeAlign="above_or_below"
        expandPopupMenuOnClick={true}
        displayExpandPopupMenuIcon={true}
        roundIcon={true}
      />
    </div>
  );
};

const MainLeftSidebar = () => {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const isMobile = useMobileContext();

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
        <HomeButton />
        <CreateButton />
        <DiscoverButton />
        <div className="flex-grow overflow-y-auto">
          <SidebarSection title="Conversations">
            <SidebarSubsection title="Recent">
              <RecentCharacters />
            </SidebarSubsection>

            <SidebarSubsection title="This Week">
              <RecentCharacters />
            </SidebarSubsection>
          </SidebarSection>
        </div>
        <div className="mt-auto mb-4">
          <UserProfile />
        </div>
      </Sidebar>
    </>
  );
};

export default MainLeftSidebar;
