"use client";

import { useEffect, useState } from "react";
import CharacterCard from "@/components/cards/CharacterCard";
import Section from "@/components/_common/Section";
import CardContainer from "@/components/cards/CardContainer";
import { createNotification } from "@/components/_common/Notification";
import { useGlobalContext } from "../_common/GlobalContextProvider";
import { callFeaturedCharactersGet, callRecommendedCharactersGet } from "@/utils/backend/callCharactersGet";
import { CharacterInfo } from "@/utils/backend/schemas/CharacterInfo";
import { usePathname } from "next/navigation";

export default function HomePage() {
  const [featuredCharacters, setFeaturedCharacters] = useState([] as CharacterInfo[]);
  const [recommendedCharacters, setRecommendedCharacters] = useState([] as CharacterInfo[]);
  const pathname = usePathname();

  const { justLoggedIn, justLoggedOut, setJustLoggedIn, setJustLoggedOut } = useGlobalContext();

  useEffect(() => {
    if (justLoggedIn) {
      createNotification('Welcome to CapyCharacter.AI. You can now start chatting with your favorite characters.');
      setJustLoggedIn(false);
    }

    if (justLoggedOut) {
      createNotification('Successfully logged out. Please log in to access full features.');
      setJustLoggedOut(false);
    }
  }, [justLoggedIn, justLoggedOut, setJustLoggedIn, setJustLoggedOut]);

  useEffect(() => {
    callFeaturedCharactersGet().then((characters) => {
      if (characters instanceof Error) {
        createNotification(characters.message);
      } else {
        setFeaturedCharacters(characters);
      }
    });

    callRecommendedCharactersGet().then((characters) => {
      if (characters instanceof Error) {
        createNotification(characters.message);
      } else {
        setRecommendedCharacters(characters);
      }
    });
  }, [pathname]); // when pathname changes, we want to fetch the characters again (because in other pages the user might have changed some characters or voices etc.)

  return (
    <main className="pt-4 px-4">
      <Section title="Featured Characters">
        <CardContainer>
          {featuredCharacters.map((character, index) => (
            <CharacterCard
              key={index}
              character={character}
            />
          ))}
        </CardContainer>
      </Section>

      <Section title="Recommended for You">
        <CardContainer>
          {recommendedCharacters.map((character, index) => (
            <CharacterCard
              key={index}
              character={character}
            />
          ))}
        </CardContainer>
      </Section>
    </main>
  );
}
