export const loadFixtureAsArrayBuffer = (fixture) => fetch(`/test/fixtures/${fixture}`).then((response) => response.arrayBuffer());

export const loadFixtureAsJson = (fixture) => fetch(`/test/fixtures/${fixture}`).then((response) => response.json());
