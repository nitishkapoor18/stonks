import fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import fastifyJwt from "@fastify/jwt";
import fastifyCors from "@fastify/cors";
import * as crypto from "crypto";

import * as dotenv from "dotenv";

dotenv.config();

function passHash(pass) {
	let hash = crypto.createHash("sha256").update(pass).digest("hex");
	return hash;
}

const fast = fastify({
	logger: true,
	ignoreTrailingSlash: true,
	ignoreDuplicateSlashes: true,
});

fast.log.info("CONNECTING TO DATABASE...");
fast.register(fastifyPostgres, {
	connectionString: process.env.POSTGRES_CON_STR,
});
fast.log.info("DATABASE CONNECTED");

fast.register(fastifyJwt, {
	secret: process.env.SECRET,
});

fast.register(fastifyCors, {
	// origin: "http://stonks.c1.biz/",
	origin: "*",
	credentials: true,
});

fast.decorate("auth", async (req, reply) => {
	try {
		await req.jwtVerify();
	} catch (err) {
		reply.code(400).send({
			type: "error",
			msg: "invalid token",
		});
	}
});

fast.get("/", (req, reply) => {
	reply.send("Hello World!");
});

fast.get("/signup/:username/:email/:pass", (req, reply) => {
	let username = req.params.username;
	let email = req.params.email;
	let pass = req.params.pass;
	if (username == " " || email == " " || pass == " ") {
		reply.code(400).send({
			type: "error",
			msg: "invalid params",
		});
	}
	pass = passHash(pass);
	fast.pg.query(
		"insert into users (username, email, password) values ($1, $2, $3);",
		[username, email, pass],
		function onResult(err, result) {
			if (err) {
				if (err.message.startsWith("duplicate key value")) {
					reply.code(400).send({
						type: "error",
						msg: "user already exists",
					});
				}
			} else {
				const token = fast.jwt.sign({
					username: username,
					email: email,
				});
				reply.send({
					type: "success",
					msg: "user registered",
					token: token,
					username,
					email,
				});
			}
		}
	);
});

fast.get("/login/:username/:email/:pass", (req, reply) => {
	let username = req.params.username;
	let email = req.params.email;
	let pass = req.params.pass;

	if (username == " " || email == " " || pass == " ") {
		reply.code(400).send({
			type: "error",
			msg: "invalid params",
		});
	}
	pass = passHash(pass);
	fast.pg.query(
		"select username, email, password from users where username = $1 and email = $2 and password = $3;",
		[username, email, pass],
		function onResult(err, result) {
			if (err) {
				reply.send(err);
			} else {
				if (result.rowCount < 1) {
					reply.send({
						type: "error",
						msg: "Invalid Username or Password.",
					});
				} else {
					const token = fast.jwt.sign({
						username: username,
						email: email,
					});
					reply.send({
						type: "success",
						msg: "Login Successful.",
						token: token,
						username,
						email,
					});
				}
			}
		}
	);
});

fast.get("/verify", { onRequest: fast.auth }, (req, reply) => {
	reply.send({
		type: "success",
		msg: "verified",
	});
});

const start = async () => {
	try {
		fast.listen({ host: "0.0.0.0", port: process.env.PORT });
		// fast.listen({ port: process.env.PORT });
	} catch (error) {
		fast.log.error(error);
		process.exit(1);
	}
};

start();
