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

ActiveRecord::Schema.define(version: 4) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "answers", id: false, force: :cascade do |t|
    t.integer  "healthcare_id", null: false
    t.integer  "user_id",       null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "consults", force: :cascade do |t|
    t.integer  "healthcare_id",              null: false
    t.integer  "secretary_id",               null: false
    t.integer  "patient_id",                 null: false
    t.integer  "insurance_id",               null: false
    t.string   "date",                       null: false
    t.string   "hour_ini",                   null: false
    t.string   "hour_end",                   null: false
    t.integer  "confirm",       default: 0
    t.string   "scheduling",    default: ""
    t.string   "obs",           default: ""
    t.integer  "status",        default: 1
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "insurances", force: :cascade do |t|
    t.string   "identifier", default: ""
    t.string   "name",                    null: false
    t.string   "city",       default: ""
    t.string   "state",      default: ""
    t.integer  "status",     default: 1
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "patients", force: :cascade do |t|
    t.string   "name",                     null: false
    t.string   "email",       default: ""
    t.string   "telephone",   default: ""
    t.string   "cellphone",   default: ""
    t.string   "birth",       default: ""
    t.string   "gender",                   null: false
    t.integer  "mail_accept"
    t.integer  "status",      default: 1
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "name",                              null: false
    t.string   "email",                             null: false
    t.string   "password_digest",                   null: false
    t.string   "career",                            null: false
    t.string   "gender",                            null: false
    t.integer  "privilege",                         null: false
    t.string   "status",          default: "Ativo"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
  end

  add_foreign_key "answers", "users", column: "healthcare_id", name: "fk_healthcare_id_answers"
  add_foreign_key "answers", "users", name: "fk_user_id_answers"
  add_foreign_key "consults", "insurances", name: "fk_insurance_id_consults"
  add_foreign_key "consults", "patients", name: "fk_patient_id_consults"
  add_foreign_key "consults", "users", column: "healthcare_id", name: "fk_healthcare_id_consults"
  add_foreign_key "consults", "users", column: "secretary_id", name: "fk_secretary_id_consults"
end
