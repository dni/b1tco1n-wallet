function Bookmarks() {
  return (
      <section id="bookmarks">
          <button>bookmarks</button>
          <button class={ showbookmarks() === true ? "hidden" : ""} onClick={(e) => setShowbookmarks(true)}>bookmarks</button>
          <div id="bookmarks-content" class={ showbookmarks() === false ? "hidden" : ""}>
              <h2>bookmark</h2>
            <button onClick={(e) => setShowbookmarks(false)}>hide bookmarks</button>
          </div>
      </section>
  );
}

export default Bookmarks;
