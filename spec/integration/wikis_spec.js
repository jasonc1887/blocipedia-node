const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis ", () => {

    beforeEach((done) => {
        this.user;
        this.wiki;
        sequelize.sync({force: true}).then((res) => {

            User.create({
                email: "user@test.com",
                password: "123456789"
            })
            .then((user) => {
                this.user = user;

                Wiki.create({
                    title: "Snowboarding",
                    body: "Send it, brah!",
                    userId: this.user.id
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    }); 
    
    describe("GET /wikis", () => {

        it("should return a status code 200 and all wikis", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                expect(body).toContain("Wikis");
                expect(body).toContain("Snowboarding");
                done();
            });
        });
    });

    describe("GET /wikis/new", () => {

        it("should render a new wiki form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Wiki");
                done();
            });
        });
    });

    describe("POST /wikis/create", () => {
        
        it("should create a new wiki and redirect", (done) => {
        
        const options = {
            url: `${base}create`,
            form: {
                title: "Rock Climbing",
                body: "Free soloing is easy!"
            }
        };

        request.post(options, 
              (err, res, body) => {
                Wiki.findOne({where: {title: "Rock Climbing"}})
                .then((wiki) => {
                    console.log(wiki);
                    expect(res.statusCode).toBe(303);
                    expect(wiki.title).toBe("Rock Climbing");
                    expect(wiki.body).toBe("Free soloing is easy!");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            }
          );
        });
    });

    describe("GET /wikis/:id", () => {

        it("should render a view with the selected wiki", (done) => {
            request.get(`${base}${this.wiki.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Snowboarding");
                done();
            });
        });
    });
});