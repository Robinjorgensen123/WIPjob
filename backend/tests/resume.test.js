// Test som verifierar att `backend/data/myResume.js` exporterar
// fälten `profile`, `skills` och `experience` som icke-tomma strängar.
// Skrivet på svenska enligt projektreglerna.
import myResume from "../data/myResume.js";

describe("Resume module", () => {
  test("exports profile, skills and experience as non-empty strings", () => {
    expect(myResume).toBeDefined();

    expect(typeof myResume.profile).toBe("string");
    expect(myResume.profile.length).toBeGreaterThan(0);

    expect(typeof myResume.skills).toBe("string");
    expect(myResume.skills.length).toBeGreaterThan(0);

    expect(typeof myResume.experience).toBe("string");
    expect(myResume.experience.length).toBeGreaterThan(0);
  });
});
