bug[] getBugs(String query, Bool showComplete, String category, int ascending/decending, int realNumberOfBugs) {
	// error handling in case of invalid bug number
	int numberOfBugs = realNumberOfBugs;
	if (realNumberOfBugs > 200) {numberOfBugs = 200;}
	else if (realNumberOfBugs < 1){numberOfBugs = 1;}


		the query is:
		SELECT * FROM bugs ORDER BY category DESC LIMIT numberOfBugs;
		SELECT * FROM bugs WHERE dateResolved = NULL ORDER BY category DESC LIMIT numberOfBugs; // this is if showComplete == false
		// ASC is ascending, DESC is descending

		// if query == "", use * or don't use a WHERE condition
		// adding "title LIKE '%something%' " will probably look for bugs that have a title matching that

	bug[numberOfBugs] arr;
	// some sql command to get that number of bugs based on the category
	// another line that fills the array with those bugs
	return the bugs array
}//
