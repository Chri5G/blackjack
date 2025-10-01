# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

ranks = %w[ace 2 3 4 5 6 7 8 9 10 jack queen king]
suits = %w[hearts diamonds clubs spades]

Card.destroy_all

suits.each do |suit|
  ranks.each do |rank|
    Card.create!(
      rank: rank,
      suit: suit,
      image_url: "/cards/#{rank}_of_#{suit}.jpg"
    )
  end
end

puts "Seeded #{Card.count} cards."