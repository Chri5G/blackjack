class Api::CardsController < ApplicationController
    def index 
    end

    def get_cards
        puts params
        @cards = Card.all.order("RANDOM()")
        
        render json: @cards
    end
end

