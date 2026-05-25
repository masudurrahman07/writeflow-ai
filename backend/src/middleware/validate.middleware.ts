import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

/**
 * Zod schema validation middleware factory.
 * Usage: router.post('/route', validate(mySchema), controller)
 */
export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.reduce<Record<string, string[]>>(
          (acc, e) => {
            const key = e.path.slice(1).join(".");
            acc[key] = [...(acc[key] ?? []), e.message];
            return acc;
          },
          {}
        );
        res.status(422).json({ success: false, message: "Validation failed.", errors });
        return;
      }
      next(error);
    }
  };
}
