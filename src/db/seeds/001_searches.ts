import { Search, SearchInputType, UrlTypes } from "@types";
import type { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { faker } from "@faker-js/faker";

const spotifyUrl =
  "https://open.spotify.com/track/75FYqcxt1YEAtqDLrOeIJn?si=607c82a0718f4629";
const deezerUrl = "https://www.deezer.com/track/62710442";

/**
 * Randomly picks a streaming service type url
 * @returns
 */
const pickRandomUrl = () => {
  return Math.random() < 0.5 ? spotifyUrl : deezerUrl;
};

/**
 * Randomly picks the search type
 * @returns searchInputType
 */
const randomizeSearchType = (): SearchInputType => {
  const random = Math.random();

  if (random < 1 / 3) {
    return "artist";
  }
  if (random >= 1 / 3 && random < 2 / 3) {
    return "track";
  } else {
    return "url";
  }
};

/**
 * Generates a url type randomly
 * @returns url type
 */
const randomizeUrlType = (): UrlTypes => {
  const random = Math.random();

  if (random < 1 / 3) {
    return "deezer";
  }
  if (random >= 1 / 3 && random < 2 / 3) {
    return "spotify";
  } else {
    return "spotifyApi";
  }
};

const createMockData = (): Omit<Search, "created_at" | "updated_at"> => {
  const searchType: SearchInputType = randomizeSearchType();

  return {
    id: uuid(),
    ip: faker.internet.ipv4(),
    city: faker.address.city(),
    country: faker.address.country(),
    coordinates: faker.address.nearbyGPSCoordinate().toString(),
    timezone: faker.address.timeZone(),
    search: searchType === "url" ? pickRandomUrl() : faker.music.songName(),
    search_type: searchType,
    url_type: searchType === "url" ? randomizeUrlType() : null,
  };
};

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("searches").del();

  const data = new Array(20).fill(null);

  // Inserts seed entries
  await Promise.all(
    data.map(async () => {
      return await knex("searches").insert(createMockData());
    }),
  );
}
