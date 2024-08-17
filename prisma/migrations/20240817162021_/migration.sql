/*
  Warnings:

  - A unique constraint covering the columns `[scene_id,web_resolution_url,high_resolution_url]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[event_id,name]` on the table `Scene` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Media_scene_id_web_resolution_url_high_resolution_url_key" ON "Media"("scene_id", "web_resolution_url", "high_resolution_url");

-- CreateIndex
CREATE UNIQUE INDEX "Scene_event_id_name_key" ON "Scene"("event_id", "name");
