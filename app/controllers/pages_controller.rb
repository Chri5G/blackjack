class PagesController < ApplicationController
    def home
        @top_scores = Score.order(score: :desc).limit(3).to_json
    end
end
