import { jsonToXml } from "./xml";

describe("xml utilities", () => {
  it("should convert JSON to XML", () => {
    const json = `{
        "name": "Molecule Man",
        "age": 29,
        "secretIdentity": "Dan Jukes",
        "powers": [
            "Radiation resistance",
            "Turning tiny",
            "Radiation blast"
        ],
        "address": {
            "street": "123 Main St",
            "city": "Anytown"
        }
    }`;

    const expectedXml = `<name>Molecule Man</name>
<age>29</age>
<secretIdentity>Dan Jukes</secretIdentity>
<powers>
  <_text>Radiation resistance</_text>
  <_text>Turning tiny</_text>
    <_text>Radiation blast</_text>
</powers>
<address>
  <street>123 Main St</street>
  <city>Anytown</city>
</address>`;

    const result = jsonToXml(json, { indentSize: 2 });
    expect(result.trim()).toBe(expectedXml.trim());
  });

  it("should return error XML for invalid JSON", () => {
    const invalidJson = `{
        "name": "Molecule Man",
        "age": 29,
        "secretIdentity": "Dan Jukes",
        "powers": [
            "Radiation resistance",
            "Turning tiny",
            "Radiation blast"
        ],
        "address": {
            "street": "123 Main St",
            "city": "Anytown"
        }`; // Missing closing }

    const result = jsonToXml(invalidJson);
    expect(result).toContain('<error>Failed to convert JSON to XML');
  });

  it("should return error XML for empty input", () => {
    const result = jsonToXml('');
    expect(result).toBe('<error>Input is empty</error>');
  });
});