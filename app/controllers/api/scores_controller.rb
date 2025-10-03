class Api::ScoresController < ApplicationController
    def index
    end

    def create
        puts "ARELLY PARAMS: #{params.inspect}"
        @score = Score.new(score_params)

        if @score.save
            render json: { score: @score, message: "Score saved!", status: :created}
        else
        render json: { errors: @score.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def update
        puts "PARAMS: #{params.inspect}"
        @score = Score.find(params[:id])

        if @score.update(score_params)
            render json: {score: @score, :message => "Score updated"}
        else
            render json: { errors: @score.errors.full_messages }, status: :unprocessable_entity
        end
    end

    private

    def score_params
        params.require(:score).permit(
            :name, 
            :score
        )
    end
end

