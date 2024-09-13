import CharacterCard from "../components/cards/CharacterCard";
import Section from "../components/_common/Section";
import CardContainer from "../components/cards/CardContainer";

export default function Home() {
  const featuredCharacters = [
    {
      name: "Sherlock Holmes",
      creator: "Arthur Conan Doyle",
      description: "Brilliant detective with exceptional deductive skills, known for his sharp wit and ability to solve complex cases.",
      chats: 1000,
      avatarUrl: "/images/fake-character-image.avif"
    },
    {
      name: "Elizabeth Bennet",
      creator: "Jane Austen",
      description: "Witty and intelligent protagonist from Pride and Prejudice",
      chats: 800,
      avatarUrl: "/images/fake-character-image.avif"
    },
    {
      name: "Tony Stark",
      creator: "Stan Lee",
      description: "Genius billionaire playboy philanthropist, also known as Iron Man",
      chats: 1500,
      avatarUrl: "/images/fake-character-image.avif"
    },
    {
      name: "Hermione Granger",
      creator: "J.K. Rowling",
      description: "Brightest witch of her age from the Harry Potter series",
      chats: 1200,
      avatarUrl: "/images/fake-character-image.avif"
    },
    {
      name: "Gandalf",
      creator: "J.R.R. Tolkien",
      description: "Wise and powerful wizard from The Lord of the Rings",
      chats: 1700,
      avatarUrl: "/images/fake-character-image.avif"
    },
    {
      name: "Lisbeth Salander",
      creator: "Stieg Larsson",
      description: "Brilliant hacker and investigator from The Girl with the Dragon Tattoo series",
      chats: 900,
      avatarUrl: "/images/fake-character-image.avif"
    }
  ];

  const recommendedCharacters = [
    {
      name: "Darth Vader",
      creator: "George Lucas",
      description: "Iconic Star Wars villain, formerly Anakin Skywalker, now a powerful Sith Lord.",
      chats: 2000,
      avatarUrl: "/images/fake-character-image.avif"
    },
    {
      name: "Katniss Everdeen",
      creator: "Suzanne Collins",
      description: "Brave and resourceful protagonist from The Hunger Games trilogy.",
      chats: 950,
      avatarUrl: "/images/fake-character-image.avif"
    },
    {
      name: "Sherlock Holmes",
      creator: "Arthur Conan Doyle",
      description: "Brilliant detective with exceptional deductive skills and sharp wit.",
      chats: 1800,
      avatarUrl: "/images/fake-character-image.avif"
    },
    {
      name: "Wonder Woman",
      creator: "William Moulton Marston",
      description: "Amazonian warrior princess and DC Comics superhero.",
      chats: 1600,
      avatarUrl: "/images/fake-character-image.avif"
    },
    {
      name: "Atticus Finch",
      creator: "Harper Lee",
      description: "Moral and compassionate lawyer from To Kill a Mockingbird.",
      chats: 1100,
      avatarUrl: "/images/fake-character-image.avif"
    },
    {
      name: "Lara Croft",
      creator: "Toby Gard",
      description: "Adventurous archaeologist and protagonist of the Tomb Raider series.",
      chats: 1400,
      avatarUrl: "/images/fake-character-image.avif"
    },
    {
      name: "Tyrion Lannister",
      creator: "George R.R. Martin",
      description: "Witty and cunning character from A Song of Ice and Fire series.",
      chats: 1900,
      avatarUrl: "/images/fake-character-image.avif"
    }
  ];

  return (
    <main className="pt-4 px-4">
      <Section title="Featured Characters">
        <CardContainer>
          {featuredCharacters.map((character, index) => (
            <CharacterCard
              key={index}
              name={character.name}
              creator={character.creator}
              description={character.description}
              chats={character.chats}
              avatarUrl={character.avatarUrl}
            />
          ))}
        </CardContainer>
      </Section>

      <Section title="Recommended for You">
        <CardContainer>
          {recommendedCharacters.map((character, index) => (
            <CharacterCard
              key={index}
              name={character.name}
              creator={character.creator}
              description={character.description}
              chats={character.chats}
              avatarUrl={character.avatarUrl}
            />
          ))}
        </CardContainer>
      </Section>
    </main>
  );
}
