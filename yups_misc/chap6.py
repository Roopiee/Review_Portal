# 1. Write a program to find the greatest of four numbers entered by the user.
# greatest = 0

# for i in range(4):
#     num = int(input(f"Please enter the number {i+1}: "))
#     if num > greatest:
#         greatest = num

# print("the greatest number is: ", greatest)

# 2. Write a program to find out whether a student has passed or failed if it requires a
# total of 40% and at least 33% in each subject to pass. Assume 3 subjects and
# take marks as an input from the user.





# 3. A spam comment is defined as a text containing following keywords:
# “Make a lot of money”, “buy now”, “subscribe this”, “click this”. Write a program
# to detect these spams.
# 4. Write a program to find whether a given username contains less than 10
# characters or not.
# username = input("Enter your username: ")
# length= len(username)

# if(length < 10):
#     print("username contains less than 10 characters")



# 5. Write a program which finds out whether a given name is present in a list or not.

names = ['roopak', 'krishna', 'great', 'the']

for i in range(4):
    name = input(f"Please enter the name {i+1}: ")
    if name in names:
        print("the name exists in the list")



# 6. Write a program to calculate the grade of a student from his marks from the
# following scheme:
# 90 – 100 => Ex
# 80 – 90 => A
# 70 – 80 => B
# 60 – 70 =>C
# 50 – 60 => D
# <50 => F
# 7. Write a program to find out whether a given post is talking about “Harry” or not.