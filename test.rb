require 'HTTParty'
result = HTTParty.get('https://ajax-puppies.herokuapp.com/breeds/130.json')

puts result;