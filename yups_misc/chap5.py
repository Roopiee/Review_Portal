# 1. Write a program to create a dictionary of Hindi words with values as their English
# translation. Provide user with an option to look it up!

# sampledict = {
#     'namaste': 'Hello',
#     'madad': 'help',
#     'ishq': 'love',
#     'pyaar': 'love',
#     'neend': 'sleep'
# }

# user_input = input("Please give a hindi word to look up the dictionary: ")

# print(f"The english translation for the word {user_input} is:", sampledict[user_input])

# 2. Write a program to input eight numbers from the user and display all the unique
# numbers (once).

# unique = {}

# for i in range(8):
#     number = int(input(f"Please enter number {i+1}: "))
#     unique[number] = True

# print(unique.keys())



# 3. Can we have a set with 18 (int) and '18' (str) as a value in it?



# 4. What will be the length of following set s:
# s = set()
# s.add(20)
# s.add(20.0)
# s.add('20') # length of s after these operations?


# 5. s = {}
# What is the type of 's'?


# 6. Create an empty dictionary. Allow 4 friends to enter their favorite language as
# value and use key as their names. Assume that the names are unique.

# empty = {}

# for i in range(4):
#     name = input("Enter your name: ")
#     langs = input("Enter your favourite language: ")

#     empty[name] = langs

# print("The name and their names are: ", empty.items())

# 7. If the names of 2 friends are same; what will happen to the program in problem
# 6?



# 8. If languages of two friends are same; what will happen to the program in problem
# 6?
# 9. Can you change the values inside a list which is contained in set S?
# s = {8, 7, 12, "Harry", [1,2]}

s = {8, 7, 12, "Harry", [1,2]}

s[1] = 10

print(s) 