class CreateCards < ActiveRecord::Migration[8.0]
  def change
    create_table :cards do |t|
      t.string :rank
      t.string :suit
      t.string :image_url

      t.timestamps
    end
  end
end
