export const loadFixtureAsArrayBuffer = (fixture) => fetch(`/base/test/fixtures/${fixture}`).then((response) => response.arrayBuffer());

export const loadFixtureAsJson = (fixture) => fetch(`/base/test/fixtures/${fixture}`).then((response) => response.json());
