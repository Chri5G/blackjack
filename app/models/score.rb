class Score < ApplicationRecord
    validates :name, :score, presence: true

    validates :score, numericality: { greater_than_or_equal_to: 0 }
end
