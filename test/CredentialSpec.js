import {readFileSync} from "fs";
import {join} from "path";
import {execute}  from "../console/credentials";

const Faker = require("faker");
const expect = require("chai").expect;

describe("Credential Specification", () =>  {
    describe("Add a command to create credential", () => {
        describe("Given I am a bot administrator", () => {
            describe("When I want to install the bot", () => {
                describe("Then I should cli a credentials.js ", () => {
                    let
                        botname,
                        username,
                        password,
                        credentialFile,
                        credentialContent
                    ;
                    before(() => {
                        botname = Faker.internet.userName();
                        username = Faker.internet.userName();
                        password =  Faker.lorem.words();
                        credentialFile = join(
                            __dirname,
                            "..",
                            "fixtures",
                            "credentials.js"
                        );
                    });
                    it("create with all args filled", (done) => {
                        let sequence;
                        function* assertion(credentials=null) {
                            yield execute(
                                botname,
                                username,
                                password,
                                credentialFile
                            );
                            yield readFileSync(credentialFile, 'utf-8');
                            yield done();
                        }
                        sequence = assertion();
                        sequence.next();
                        credentialContent = sequence.next();
                        expect(credentialContent.value)
                            .to.be.a("string")
                            .to.have.length.above(0)
                        ;
                        sequence.next();
                    });
                });
            });
        });
    });
});
