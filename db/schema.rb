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

ActiveRecord::Schema.define(version: 20150922143407) do

  create_table "consults", force: :cascade do |t|
    t.string   "typeConsult"
    t.string   "namePatient"
    t.string   "telephonePatient"
    t.string   "emailPatient"
    t.string   "agreement"
    t.string   "dateConsult"
    t.string   "hourIniConsult"
    t.string   "obsConsult"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "cellphonePatient"
    t.string   "hourEndConsult"
  end

  create_table "patients", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.string   "tellephone"
    t.string   "cellphone"
    t.string   "birth"
    t.string   "gender"
    t.integer  "mailAccept"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
