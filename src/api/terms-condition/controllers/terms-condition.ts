/**
 * terms-condition controller
 */
import { Strapi } from "@strapi/strapi";
import { factories } from "@strapi/strapi";
import { BaseContext } from "koa";
import slugify from "slugify";

export default factories.createCoreController(
  "api::terms-condition.terms-condition",
  ({ strapi }: { strapi: Strapi }) => ({
    async find(ctx: BaseContext) {
      const {
        data: {
          attributes: { content },
        },
        meta,
      } = await super.find(ctx);

      const parseMarkdown = (markdown: string) => {
        const headingMap = {
          "####": "h4",
          "###": "h3",
          "##": "h2",
          "#": "h1",
        };

        const headings = [];

        const result = markdown
          .split("\n")
          .filter((p: string) => p)
          .map((p: string) => {
            const hashes = Array(p.match(/^(#+)/)?.[0]?.length ?? 0)
              .fill("#")
              .join("") as keyof typeof headingMap;

            const element = headingMap[hashes] ?? "p";
            const text = p.slice(hashes.length);
            return {
              element,
              text,
              id: element !== "p" ? slugify(text, { lower: true }) : undefined,
            };
          });
        result.forEach((p) => {
          p.text = p.text.trim();
        });
        return result;
      };

      return parseMarkdown(content);
    },
  })
);
