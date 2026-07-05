-- Stateless JWT revocation: every token embeds the token_version it was signed
-- at; bumping this column invalidates all previously-issued tokens for the user.
ALTER TABLE "users" ADD COLUMN "token_version" INTEGER NOT NULL DEFAULT 0;
