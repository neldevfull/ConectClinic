# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151014233037) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "consults", force: :cascade do |t|
    t.integer  "patient_id"
    t.string   "type"
    t.string   "date"
    t.string   "hour_ini"
    t.string   "hour_end"
    t.integer  "confirm",    default: 0
    t.integer  "status",     default: 1
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "insurances", force: :cascade do |t|
    t.integer  "locale_id"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "locales", force: :cascade do |t|
    t.integer  "code"
    t.string   "city"
    t.string   "state"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "logins", force: :cascade do |t|
    t.string   "email"
    t.string   "passw"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "patients", force: :cascade do |t|
    t.integer  "insurance_id"
    t.string   "name"
    t.string   "email"
    t.string   "telephone"
    t.string   "cellphone"
    t.string   "birth"
    t.string   "gender"
    t.integer  "mail_accept"
    t.integer  "status",       default: 1
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

end
