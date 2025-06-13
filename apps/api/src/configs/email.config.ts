import { registerAs } from "@nestjs/config";

export default registerAs(
	"email",
	(): Record<string, any> => ({
		fromEmail: "no-reply@hitbeatclub.com",
		domain: process.env.DOMAIN,
		autoInitTemplates: process.env.EMAIL_AUTO_INIT_TEMPLATES === "false" ? false : true,
	}),
);
