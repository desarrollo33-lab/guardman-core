
import fs from 'fs';

const db = {
  run: (sqlObj) => {
    console.log(sqlObj.text + '\n');
  }
};
function sql(strings, ...values) {
  let str = '';
  for(let i=0; i<strings.length; i++) {
    str += strings[i];
    if (i < values.length) str += values[i];
  }
  return { text: str };
}



async function up({ db }) {

  await db.run(sql`CREATE TABLE \`users_sales_profile_preferred_zones\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`zone\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sales_profile_preferred_zones_order_idx\` ON \`users_sales_profile_preferred_zones\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sales_profile_preferred_zones_parent_id_idx\` ON \`users_sales_profile_preferred_zones\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users_sales_profile_specializations\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`persona\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sales_profile_specializations_order_idx\` ON \`users_sales_profile_specializations\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sales_profile_specializations_parent_id_idx\` ON \`users_sales_profile_specializations\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'Guardman Chile',
  	\`site_description\` text DEFAULT 'Servicios de seguridad privada en Santiago, Chile',
  	\`logo_id\` integer,
  	\`favicon_id\` integer,
  	\`contact_email\` text,
  	\`contact_phone\` text,
  	\`contact_whatsapp\` text,
  	\`address\` text,
  	\`api_keys_serper_api_key\` text,
  	\`api_keys_glm_api_key\` text,
  	\`api_keys_telegram_bot_token\` text,
  	\`api_keys_telegram_admin_chat_id\` text,
  	\`glm_config_model\` text DEFAULT 'glm-5',
  	\`glm_config_temperature\` numeric DEFAULT 0.7,
  	\`glm_config_max_tokens\` numeric DEFAULT 2048,
  	\`limits_serper_monthly_limit\` numeric DEFAULT 5000,
  	\`limits_glm_monthly_limit\` numeric DEFAULT 1000,
  	\`limits_current_serper_usage\` numeric DEFAULT 0,
  	\`limits_current_glm_usage\` numeric DEFAULT 0,
  	\`limits_billing_period_start\` text,
  	\`leads_config_auto_assign\` integer DEFAULT true,
  	\`leads_config_notify_on_new_lead\` integer DEFAULT true,
  	\`leads_config_default_score\` numeric DEFAULT 50,
  	\`social_facebook\` text,
  	\`social_instagram\` text,
  	\`social_linkedin\` text,
  	\`social_youtube\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_logo_idx\` ON \`settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_favicon_idx\` ON \`settings\` (\`favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`settings_updated_at_idx\` ON \`settings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`settings_created_at_idx\` ON \`settings\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`locations_main_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`locations_main_keywords_order_idx\` ON \`locations_main_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`locations_main_keywords_parent_id_idx\` ON \`locations_main_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`locations_service_areas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`area\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`locations_service_areas_order_idx\` ON \`locations_service_areas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`locations_service_areas_parent_id_idx\` ON \`locations_service_areas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`locations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`region\` text DEFAULT 'rm',
  	\`geo_zone\` text NOT NULL,
  	\`tier\` text DEFAULT 'medium',
  	\`characteristics\` text,
  	\`population\` numeric,
  	\`coordinates_lat\` numeric,
  	\`coordinates_lng\` numeric,
  	\`priority_score\` numeric DEFAULT 50,
  	\`is_active\` integer DEFAULT true,
  	\`seo_meta_title\` text,
  	\`seo_meta_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`locations_slug_idx\` ON \`locations\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`locations_updated_at_idx\` ON \`locations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`locations_created_at_idx\` ON \`locations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`neighborhoods_main_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`neighborhoods\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`neighborhoods_main_keywords_order_idx\` ON \`neighborhoods_main_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`neighborhoods_main_keywords_parent_id_idx\` ON \`neighborhoods_main_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`neighborhoods\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`location_id\` integer NOT NULL,
  	\`description\` text,
  	\`characteristics\` text,
  	\`coordinates_lat\` numeric,
  	\`coordinates_lng\` numeric,
  	\`priority_score\` numeric DEFAULT 50,
  	\`is_active\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`neighborhoods_slug_idx\` ON \`neighborhoods\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`neighborhoods_location_idx\` ON \`neighborhoods\` (\`location_id\`);`)
  await db.run(sql`CREATE INDEX \`neighborhoods_updated_at_idx\` ON \`neighborhoods\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`neighborhoods_created_at_idx\` ON \`neighborhoods\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`services_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_features_order_idx\` ON \`services_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_features_parent_id_idx\` ON \`services_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`benefit\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_benefits_order_idx\` ON \`services_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_benefits_parent_id_idx\` ON \`services_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_keywords_order_idx\` ON \`services_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_keywords_parent_id_idx\` ON \`services_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_faq_order_idx\` ON \`services_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`services_faq_parent_id_idx\` ON \`services_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`short_description\` text,
  	\`description\` text,
  	\`icon\` text,
  	\`featured_image_id\` integer,
  	\`price_range_min\` numeric,
  	\`price_range_max\` numeric,
  	\`price_range_billing_period\` text,
  	\`price_range_hide_price\` integer DEFAULT false,
  	\`is_highlighted\` integer DEFAULT false,
  	\`is_active\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	\`seo_meta_title\` text,
  	\`seo_meta_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`services_slug_idx\` ON \`services\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`services_featured_image_idx\` ON \`services\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`services_updated_at_idx\` ON \`services\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`services_created_at_idx\` ON \`services\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`services_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`locations_id\` integer,
  	\`industries_id\` integer,
  	\`problems_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`locations_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`industries_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`problems_id\`) REFERENCES \`problems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`services_rels_order_idx\` ON \`services_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_parent_idx\` ON \`services_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_path_idx\` ON \`services_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_locations_id_idx\` ON \`services_rels\` (\`locations_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_industries_id_idx\` ON \`services_rels\` (\`industries_id\`);`)
  await db.run(sql`CREATE INDEX \`services_rels_problems_id_idx\` ON \`services_rels\` (\`problems_id\`);`)
  await db.run(sql`CREATE TABLE \`problems_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text,
  	\`intent\` text,
  	\`volume\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`problems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`problems_keywords_order_idx\` ON \`problems_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`problems_keywords_parent_id_idx\` ON \`problems_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`problems_pain_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pain_point\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`problems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`problems_pain_points_order_idx\` ON \`problems_pain_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`problems_pain_points_parent_id_idx\` ON \`problems_pain_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`problems\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`serper_data_news_count\` numeric,
  	\`serper_data_search_volume\` numeric,
  	\`serper_data_trending\` text,
  	\`serper_data_last_checked\` text,
  	\`is_active\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`problems_slug_idx\` ON \`problems\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`problems_updated_at_idx\` ON \`problems\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`problems_created_at_idx\` ON \`problems\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`problems_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`services_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`problems\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`problems_rels_order_idx\` ON \`problems_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`problems_rels_parent_idx\` ON \`problems_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`problems_rels_path_idx\` ON \`problems_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`problems_rels_services_id_idx\` ON \`problems_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE TABLE \`industries_target_personas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`persona\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`industries_target_personas_order_idx\` ON \`industries_target_personas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_target_personas_parent_id_idx\` ON \`industries_target_personas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`industries_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`feature\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`industries_features_order_idx\` ON \`industries_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_features_parent_id_idx\` ON \`industries_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`industries_statistics_main_risks\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`risk\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`industries_statistics_main_risks_order_idx\` ON \`industries_statistics_main_risks\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_statistics_main_risks_parent_id_idx\` ON \`industries_statistics_main_risks\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`industries_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`industries_keywords_order_idx\` ON \`industries_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_keywords_parent_id_idx\` ON \`industries_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`industries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`icon\` text,
  	\`image_id\` integer,
  	\`statistics_market_size\` text,
  	\`statistics_growth_rate\` text,
  	\`case_study_id\` integer,
  	\`is_active\` integer DEFAULT true,
  	\`seo_meta_title\` text,
  	\`seo_meta_description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`case_study_id\`) REFERENCES \`blog\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`industries_slug_idx\` ON \`industries\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`industries_image_idx\` ON \`industries\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_case_study_idx\` ON \`industries\` (\`case_study_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_updated_at_idx\` ON \`industries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`industries_created_at_idx\` ON \`industries\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`industries_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`services_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`industries_rels_order_idx\` ON \`industries_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`industries_rels_parent_idx\` ON \`industries_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_rels_path_idx\` ON \`industries_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`industries_rels_services_id_idx\` ON \`industries_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE TABLE \`solutions_target_personas\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`persona\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_target_personas_order_idx\` ON \`solutions_target_personas\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_target_personas_parent_id_idx\` ON \`solutions_target_personas\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`solutions_includes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_includes_order_idx\` ON \`solutions_includes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_includes_parent_id_idx\` ON \`solutions_includes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`solutions_benefits\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`benefit\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_benefits_order_idx\` ON \`solutions_benefits\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_benefits_parent_id_idx\` ON \`solutions_benefits\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`solutions_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_keywords_order_idx\` ON \`solutions_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_keywords_parent_id_idx\` ON \`solutions_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`solutions_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_faq_order_idx\` ON \`solutions_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_faq_parent_id_idx\` ON \`solutions_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`solutions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`short_description\` text,
  	\`description\` text,
  	\`icon\` text,
  	\`image_id\` integer,
  	\`industry_id\` integer,
  	\`pricing_min\` numeric,
  	\`pricing_max\` numeric,
  	\`pricing_billing_period\` text,
  	\`pricing_hide_price\` integer DEFAULT false,
  	\`is_highlighted\` integer DEFAULT false,
  	\`is_active\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`industry_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`solutions_slug_idx\` ON \`solutions\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`solutions_image_idx\` ON \`solutions\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`solutions_industry_idx\` ON \`solutions\` (\`industry_id\`);`)
  await db.run(sql`CREATE INDEX \`solutions_updated_at_idx\` ON \`solutions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`solutions_created_at_idx\` ON \`solutions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`solutions_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`services_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`solutions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`solutions_rels_order_idx\` ON \`solutions_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`solutions_rels_parent_idx\` ON \`solutions_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`solutions_rels_path_idx\` ON \`solutions_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`solutions_rels_services_id_idx\` ON \`solutions_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE TABLE \`personas_pain_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pain\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`personas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`personas_pain_points_order_idx\` ON \`personas_pain_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`personas_pain_points_parent_id_idx\` ON \`personas_pain_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`personas_needs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`need\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`personas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`personas_needs_order_idx\` ON \`personas_needs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`personas_needs_parent_id_idx\` ON \`personas_needs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`personas_goals\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`goal\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`personas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`personas_goals_order_idx\` ON \`personas_goals\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`personas_goals_parent_id_idx\` ON \`personas_goals\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`personas_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`personas\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`personas_keywords_order_idx\` ON \`personas_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`personas_keywords_parent_id_idx\` ON \`personas_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`personas\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`avatar_id\` integer,
  	\`demographics_age_range\` text,
  	\`demographics_location\` text,
  	\`demographics_income_level\` text,
  	\`budget_range_min\` numeric,
  	\`budget_range_max\` numeric,
  	\`decision_timeline\` text,
  	\`communication_preferred_channel\` text,
  	\`communication_tone\` text,
  	\`scoring_base_score\` numeric DEFAULT 10,
  	\`scoring_urgency_weight\` numeric DEFAULT 15,
  	\`is_active\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`personas_slug_idx\` ON \`personas\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`personas_avatar_idx\` ON \`personas\` (\`avatar_id\`);`)
  await db.run(sql`CREATE INDEX \`personas_updated_at_idx\` ON \`personas\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`personas_created_at_idx\` ON \`personas\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`personas_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`services_id\` integer,
  	\`industries_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`personas\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`industries_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`personas_rels_order_idx\` ON \`personas_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`personas_rels_parent_idx\` ON \`personas_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`personas_rels_path_idx\` ON \`personas_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`personas_rels_services_id_idx\` ON \`personas_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`personas_rels_industries_id_idx\` ON \`personas_rels\` (\`industries_id\`);`)
  await db.run(sql`CREATE TABLE \`leads_internal_classification_detected_problems\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`problem\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_internal_classification_detected_problems_order_idx\` ON \`leads_internal_classification_detected_problems\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`leads_internal_classification_detected_problems_parent_id_idx\` ON \`leads_internal_classification_detected_problems\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`leads_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_tags_order_idx\` ON \`leads_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`leads_tags_parent_id_idx\` ON \`leads_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`leads_notes\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`note\` text,
  	\`date\` text,
  	\`user_id\` integer,
  	FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_notes_order_idx\` ON \`leads_notes\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`leads_notes_parent_id_idx\` ON \`leads_notes\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`leads_notes_user_idx\` ON \`leads_notes\` (\`user_id\`);`)
  await db.run(sql`CREATE TABLE \`leads_follow_ups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`date\` text,
  	\`type\` text,
  	\`result\` text,
  	\`next_action\` text,
  	\`next_follow_up\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_follow_ups_order_idx\` ON \`leads_follow_ups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`leads_follow_ups_parent_id_idx\` ON \`leads_follow_ups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`leads\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text,
  	\`phone\` text NOT NULL,
  	\`company\` text,
  	\`message\` text NOT NULL,
  	\`source_page_url\` text,
  	\`source_location_id\` integer,
  	\`source_neighborhood_id\` integer,
  	\`source_service_id\` integer,
  	\`source_referrer\` text,
  	\`source_normalized_phone\` text,
  	\`source_form_id\` text,
  	\`source_utm_source\` text,
  	\`source_utm_medium\` text,
  	\`source_utm_campaign\` text,
  	\`internal_classification_detected_persona\` text,
  	\`internal_classification_estimated_budget\` text,
  	\`internal_classification_urgency\` text,
  	\`internal_classification_analyzed_at\` text,
  	\`internal_classification_model_used\` text,
  	\`score\` numeric DEFAULT 50,
  	\`smart_action\` text DEFAULT 'FOLLOW_UP',
  	\`status\` text DEFAULT 'new',
  	\`assigned_to_id\` integer,
  	\`is_auto_generated\` integer DEFAULT false,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`last_contacted_at\` text,
  	\`converted_at\` text,
  	FOREIGN KEY (\`source_location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`source_neighborhood_id\`) REFERENCES \`neighborhoods\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`source_service_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`assigned_to_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`leads_source_source_location_idx\` ON \`leads\` (\`source_location_id\`);`)
  await db.run(sql`CREATE INDEX \`leads_source_source_neighborhood_idx\` ON \`leads\` (\`source_neighborhood_id\`);`)
  await db.run(sql`CREATE INDEX \`leads_source_source_service_idx\` ON \`leads\` (\`source_service_id\`);`)
  await db.run(sql`CREATE INDEX \`leads_assigned_to_idx\` ON \`leads\` (\`assigned_to_id\`);`)
  await db.run(sql`CREATE TABLE \`lead_duplicates_lead_ids\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`lead_id\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`lead_duplicates\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`lead_duplicates_lead_ids_order_idx\` ON \`lead_duplicates_lead_ids\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`lead_duplicates_lead_ids_parent_id_idx\` ON \`lead_duplicates_lead_ids\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`lead_duplicates\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`normalized_phone\` text NOT NULL,
  	\`occurrence_count\` numeric DEFAULT 1,
  	\`first_seen\` text,
  	\`last_seen\` text,
  	\`status\` text DEFAULT 'unresolved',
  	\`resolution_resolved_by_id\` integer,
  	\`resolution_resolved_at\` text,
  	\`resolution_notes\` text,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`resolution_resolved_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`lead_duplicates_normalized_phone_idx\` ON \`lead_duplicates\` (\`normalized_phone\`);`)
  await db.run(sql`CREATE INDEX \`lead_duplicates_resolution_resolution_resolved_by_idx\` ON \`lead_duplicates\` (\`resolution_resolved_by_id\`);`)
  await db.run(sql`CREATE INDEX \`lead_duplicates_updated_at_idx\` ON \`lead_duplicates\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`lead_duplicates_created_at_idx\` ON \`lead_duplicates\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`scoring_rules_persona_weights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`persona\` text,
  	\`weight\` numeric DEFAULT 10,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`scoring_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`scoring_rules_persona_weights_order_idx\` ON \`scoring_rules_persona_weights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`scoring_rules_persona_weights_parent_id_idx\` ON \`scoring_rules_persona_weights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`scoring_rules_budget_weights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`budget\` text,
  	\`weight\` numeric DEFAULT 10,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`scoring_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`scoring_rules_budget_weights_order_idx\` ON \`scoring_rules_budget_weights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`scoring_rules_budget_weights_parent_id_idx\` ON \`scoring_rules_budget_weights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`scoring_rules_urgency_weights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`urgency\` text,
  	\`weight\` numeric DEFAULT 5,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`scoring_rules\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`scoring_rules_urgency_weights_order_idx\` ON \`scoring_rules_urgency_weights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`scoring_rules_urgency_weights_parent_id_idx\` ON \`scoring_rules_urgency_weights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`scoring_rules\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`description\` text,
  	\`is_active\` integer DEFAULT true,
  	\`message_quality_weight\` numeric DEFAULT 15,
  	\`action_thresholds_urgent_contact\` numeric DEFAULT 80,
  	\`action_thresholds_follow_up\` numeric DEFAULT 50,
  	\`action_thresholds_not_qualified\` numeric DEFAULT 30,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`scoring_rules_updated_at_idx\` ON \`scoring_rules\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`scoring_rules_created_at_idx\` ON \`scoring_rules\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`seo_pages_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`seo_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`seo_pages_highlights_order_idx\` ON \`seo_pages_highlights\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_highlights_parent_id_idx\` ON \`seo_pages_highlights\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`seo_pages_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`seo_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`seo_pages_faq_order_idx\` ON \`seo_pages_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_faq_parent_id_idx\` ON \`seo_pages_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`seo_pages_glm_analysis_opportunities\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`opportunity\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`seo_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`seo_pages_glm_analysis_opportunities_order_idx\` ON \`seo_pages_glm_analysis_opportunities\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_glm_analysis_opportunities_parent_id_idx\` ON \`seo_pages_glm_analysis_opportunities\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`seo_pages_glm_analysis_recommended_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`seo_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`seo_pages_glm_analysis_recommended_keywords_order_idx\` ON \`seo_pages_glm_analysis_recommended_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_glm_analysis_recommended_keywords_parent_id_idx\` ON \`seo_pages_glm_analysis_recommended_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`seo_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`page_type\` text NOT NULL,
  	\`location_id\` integer,
  	\`service_id\` integer,
  	\`industry_id\` integer,
  	\`persona_id\` integer,
  	\`problem_id\` integer,
  	\`seo_meta_title\` text,
  	\`seo_meta_description\` text,
  	\`seo_h1\` text,
  	\`seo_canonical_url\` text,
  	\`seo_og_image_id\` integer,
  	\`hero_headline\` text,
  	\`hero_subheadline\` text,
  	\`hero_cta_text\` text,
  	\`hero_cta_link\` text,
  	\`hero_background_image_id\` integer,
  	\`content\` text,
  	\`price_range_min\` numeric,
  	\`price_range_max\` numeric,
  	\`price_range_billing_period\` text,
  	\`price_range_hide_price\` integer DEFAULT false,
  	\`glm_generated\` integer,
  	\`serper_enriched\` integer,
  	\`glm_analysis_score\` numeric,
  	\`priority_score\` numeric DEFAULT 50,
  	\`status\` text DEFAULT 'draft',
  	\`published_at\` text,
  	\`views\` numeric DEFAULT 0,
  	\`schema_markup\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`industry_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`persona_id\`) REFERENCES \`personas\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`problem_id\`) REFERENCES \`problems\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`seo_pages_slug_idx\` ON \`seo_pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_location_idx\` ON \`seo_pages\` (\`location_id\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_service_idx\` ON \`seo_pages\` (\`service_id\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_industry_idx\` ON \`seo_pages\` (\`industry_id\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_persona_idx\` ON \`seo_pages\` (\`persona_id\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_problem_idx\` ON \`seo_pages\` (\`problem_id\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_seo_seo_og_image_idx\` ON \`seo_pages\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_hero_hero_background_image_idx\` ON \`seo_pages\` (\`hero_background_image_id\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_updated_at_idx\` ON \`seo_pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_created_at_idx\` ON \`seo_pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`seo_pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`testimonials_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`seo_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`seo_pages_rels_order_idx\` ON \`seo_pages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_rels_parent_idx\` ON \`seo_pages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_rels_path_idx\` ON \`seo_pages_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`seo_pages_rels_testimonials_id_idx\` ON \`seo_pages_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE TABLE \`keywords_related_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text,
  	\`intent\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`keywords\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`keywords_related_keywords_order_idx\` ON \`keywords_related_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`keywords_related_keywords_parent_id_idx\` ON \`keywords_related_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`keywords_serper_metrics_top_competitors\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`competitor\` text,
  	\`position\` numeric,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`keywords\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`keywords_serper_metrics_top_competitors_order_idx\` ON \`keywords_serper_metrics_top_competitors\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`keywords_serper_metrics_top_competitors_parent_id_idx\` ON \`keywords_serper_metrics_top_competitors\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`keywords\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`keyword\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`location_id\` integer,
  	\`service_id\` integer,
  	\`problem_id\` integer,
  	\`cluster\` text,
  	\`intent\` text,
  	\`serper_metrics_result_count\` numeric,
  	\`serper_metrics_ads_count\` numeric,
  	\`serper_metrics_searched_at\` text,
  	\`glm_analysis_difficulty\` numeric,
  	\`glm_analysis_volume\` text,
  	\`glm_analysis_opportunity\` text,
  	\`glm_analysis_recommended_url\` text,
  	\`glm_analysis_analyzed_at\` text,
  	\`is_tracked\` integer DEFAULT false,
  	\`target_position\` numeric DEFAULT 10,
  	\`current_position\` numeric,
  	\`priority\` text DEFAULT 'medium',
  	\`seo_page_id\` integer,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`service_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`problem_id\`) REFERENCES \`problems\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_page_id\`) REFERENCES \`seo_pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`keywords_location_idx\` ON \`keywords\` (\`location_id\`);`)
  await db.run(sql`CREATE INDEX \`keywords_service_idx\` ON \`keywords\` (\`service_id\`);`)
  await db.run(sql`CREATE INDEX \`keywords_problem_idx\` ON \`keywords\` (\`problem_id\`);`)
  await db.run(sql`CREATE INDEX \`keywords_seo_page_idx\` ON \`keywords\` (\`seo_page_id\`);`)
  await db.run(sql`CREATE TABLE \`testimonials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`client_name\` text NOT NULL,
  	\`company\` text,
  	\`position\` text,
  	\`testimonial\` text NOT NULL,
  	\`rating\` numeric DEFAULT 5,
  	\`location_id\` integer,
  	\`neighborhood_id\` integer,
  	\`industry_id\` integer,
  	\`photo_id\` integer,
  	\`video_url\` text,
  	\`is_approved\` integer DEFAULT false,
  	\`is_featured\` integer DEFAULT false,
  	\`use_in_homepage\` integer DEFAULT false,
  	\`use_in_location_pages\` integer DEFAULT false,
  	\`order\` numeric DEFAULT 0,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`location_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`neighborhood_id\`) REFERENCES \`neighborhoods\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`industry_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials_location_idx\` ON \`testimonials\` (\`location_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_neighborhood_idx\` ON \`testimonials\` (\`neighborhood_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_industry_idx\` ON \`testimonials\` (\`industry_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_photo_idx\` ON \`testimonials\` (\`photo_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE TABLE \`testimonials_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`services_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials_rels_order_idx\` ON \`testimonials_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_rels_parent_idx\` ON \`testimonials_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_rels_path_idx\` ON \`testimonials_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_rels_services_id_idx\` ON \`testimonials_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE TABLE \`blog_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`blog\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blog_tags_order_idx\` ON \`blog_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`blog_tags_parent_id_idx\` ON \`blog_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`blog\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`excerpt\` text,
  	\`content\` text,
  	\`featured_image_id\` integer,
  	\`category\` text,
  	\`author_id\` integer,
  	\`seo_meta_title\` text,
  	\`seo_meta_description\` text,
  	\`seo_canonical_url\` text,
  	\`seo_og_image_id\` integer,
  	\`status\` text DEFAULT 'draft',
  	\`published_at\` text,
  	\`featured\` integer DEFAULT false,
  	\`views\` numeric DEFAULT 0,
  	\`reading_time\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`featured_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`blog_slug_idx\` ON \`blog\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`blog_featured_image_idx\` ON \`blog\` (\`featured_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_author_idx\` ON \`blog\` (\`author_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_seo_seo_og_image_idx\` ON \`blog\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_updated_at_idx\` ON \`blog\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`blog_created_at_idx\` ON \`blog\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`blog_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`locations_id\` integer,
  	\`services_id\` integer,
  	\`problems_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`blog\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`locations_id\`) REFERENCES \`locations\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`services_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`problems_id\`) REFERENCES \`problems\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`blog_rels_order_idx\` ON \`blog_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`blog_rels_parent_idx\` ON \`blog_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_rels_path_idx\` ON \`blog_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`blog_rels_locations_id_idx\` ON \`blog_rels\` (\`locations_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_rels_services_id_idx\` ON \`blog_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`blog_rels_problems_id_idx\` ON \`blog_rels\` (\`problems_id\`);`)
  await db.run(sql`CREATE TABLE \`forms_lead_config_add_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_lead_config_add_tags_order_idx\` ON \`forms_lead_config_add_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_lead_config_add_tags_parent_id_idx\` ON \`forms_lead_config_add_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`forms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`description\` text,
  	\`submit_button_label\` text DEFAULT 'Enviar',
  	\`confirmation_type\` text DEFAULT 'message',
  	\`confirmation_message\` text,
  	\`redirect_url\` text,
  	\`send_confirmation_email\` integer DEFAULT false,
  	\`confirmation_email_subject\` text,
  	\`create_lead\` integer DEFAULT true,
  	\`lead_config_default_source\` text,
  	\`lead_config_assign_to_id\` integer,
  	\`lead_config_notify_on_submit\` integer DEFAULT true,
  	\`enable_captcha\` integer DEFAULT true,
  	\`is_active\` integer DEFAULT true,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`lead_config_assign_to_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`forms_slug_idx\` ON \`forms\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`forms_lead_config_lead_config_assign_to_idx\` ON \`forms\` (\`lead_config_assign_to_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_updated_at_idx\` ON \`forms\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`forms_created_at_idx\` ON \`forms\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`form_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_id\` integer NOT NULL,
  	\`submission_data\` text NOT NULL,
  	\`ip\` text,
  	\`user_agent\` text,
  	\`referrer\` text,
  	\`lead_id\` integer,
  	\`status\` text DEFAULT 'processed',
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`lead_id\`) REFERENCES \`leads\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`form_submissions_form_idx\` ON \`form_submissions\` (\`form_id\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_lead_idx\` ON \`form_submissions\` (\`lead_id\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_updated_at_idx\` ON \`form_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_created_at_idx\` ON \`form_submissions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text,
  	\`caption\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_og_url\` text,
  	\`sizes_og_width\` numeric,
  	\`sizes_og_height\` numeric,
  	\`sizes_og_mime_type\` text,
  	\`sizes_og_filesize\` numeric,
  	\`sizes_og_filename\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_media\`("id", "alt", "caption", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y", "sizes_thumbnail_url", "sizes_thumbnail_width", "sizes_thumbnail_height", "sizes_thumbnail_mime_type", "sizes_thumbnail_filesize", "sizes_thumbnail_filename", "sizes_card_url", "sizes_card_width", "sizes_card_height", "sizes_card_mime_type", "sizes_card_filesize", "sizes_card_filename", "sizes_og_url", "sizes_og_width", "sizes_og_height", "sizes_og_mime_type", "sizes_og_filesize", "sizes_og_filename") SELECT "id", "alt", "caption", "updated_at", "created_at", "url", "thumbnail_u_r_l", "filename", "mime_type", "filesize", "width", "height", "focal_x", "focal_y", "sizes_thumbnail_url", "sizes_thumbnail_width", "sizes_thumbnail_height", "sizes_thumbnail_mime_type", "sizes_thumbnail_filesize", "sizes_thumbnail_filename", "sizes_card_url", "sizes_card_width", "sizes_card_height", "sizes_card_mime_type", "sizes_card_filesize", "sizes_card_filename", "sizes_og_url", "sizes_og_width", "sizes_og_height", "sizes_og_mime_type", "sizes_og_filesize", "sizes_og_filename" FROM \`media\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`ALTER TABLE \`__new_media\` RENAME TO \`media\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_og_sizes_og_filename_idx\` ON \`media\` (\`sizes_og_filename\`);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`name\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`role\` text DEFAULT 'sales';`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`avatar_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`phone\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`is_active\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`telegram_chat_id\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`telegram_username\` text;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`telegram_notifications_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`telegram_notify_on_new_lead\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`telegram_notify_on_status_change\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`sales_profile_working_hours_start\` numeric DEFAULT 9;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`sales_profile_working_hours_end\` numeric DEFAULT 18;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`sales_profile_max_pending_leads\` numeric DEFAULT 10;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`stats_total_leads\` numeric DEFAULT 0;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`stats_converted_leads\` numeric DEFAULT 0;`)
  await db.run(sql`ALTER TABLE \`users\` ADD \`stats_conversion_rate\` numeric DEFAULT 0;`)
  await db.run(sql`CREATE INDEX \`users_avatar_idx\` ON \`users\` (\`avatar_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`settings_id\` integer REFERENCES settings(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`locations_id\` integer REFERENCES locations(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`neighborhoods_id\` integer REFERENCES neighborhoods(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`services_id\` integer REFERENCES services(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`problems_id\` integer REFERENCES problems(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`industries_id\` integer REFERENCES industries(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`solutions_id\` integer REFERENCES solutions(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`personas_id\` integer REFERENCES personas(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`leads_id\` integer REFERENCES leads(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`lead_duplicates_id\` integer REFERENCES lead_duplicates(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`scoring_rules_id\` integer REFERENCES scoring_rules(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`seo_pages_id\` integer REFERENCES seo_pages(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`keywords_id\` integer REFERENCES keywords(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`testimonials_id\` integer REFERENCES testimonials(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`blog_id\` integer REFERENCES blog(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`forms_id\` integer REFERENCES forms(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`form_submissions_id\` integer REFERENCES form_submissions(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_settings_id_idx\` ON \`payload_locked_documents_rels\` (\`settings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_locations_id_idx\` ON \`payload_locked_documents_rels\` (\`locations_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_neighborhoods_id_idx\` ON \`payload_locked_documents_rels\` (\`neighborhoods_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_services_id_idx\` ON \`payload_locked_documents_rels\` (\`services_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_problems_id_idx\` ON \`payload_locked_documents_rels\` (\`problems_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_industries_id_idx\` ON \`payload_locked_documents_rels\` (\`industries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_solutions_id_idx\` ON \`payload_locked_documents_rels\` (\`solutions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_personas_id_idx\` ON \`payload_locked_documents_rels\` (\`personas_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_leads_id_idx\` ON \`payload_locked_documents_rels\` (\`leads_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_lead_duplicates_id_idx\` ON \`payload_locked_documents_rels\` (\`lead_duplicates_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_scoring_rules_id_idx\` ON \`payload_locked_documents_rels\` (\`scoring_rules_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_seo_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`seo_pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_keywords_id_idx\` ON \`payload_locked_documents_rels\` (\`keywords_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_blog_id_idx\` ON \`payload_locked_documents_rels\` (\`blog_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
}


up({ db }).catch(console.error);
