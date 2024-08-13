-- AlterTable
CREATE SEQUENCE sharelink_id_seq;
ALTER TABLE "ShareLink" ALTER COLUMN "id" SET DEFAULT nextval('sharelink_id_seq');
ALTER SEQUENCE sharelink_id_seq OWNED BY "ShareLink"."id";
