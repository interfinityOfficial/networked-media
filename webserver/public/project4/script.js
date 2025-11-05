function deletePost(id) {
    console.log(id);
    fetch("/api/project4/", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const post = document.getElementById("post-" + id);
                post.remove();
            } else {
                alert("Failed to delete post");
            }
        })
        .catch(() => {
            alert("Failed to delete post");
        });
}

window.onload = () => {
    const posts = document.getElementById("posts");
    const newPostInput = document.getElementById("new-post-input");
    const submitButton = document.getElementById("submit-button");

    const deleteButtonIcon =
        `<svg
              class="delete-button-icon"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 16.2734 15.928"
            >
              <g>
                <rect height="15.928" opacity="0" width="16.2734" x="0" y="0" />
                <path
                  d="M13.7728 0.373534L0.349341 13.8001C-0.113117 14.2595-0.122883 15.0898 0.358657 15.5678C0.843303 16.0427 1.67988 16.0334 2.13613 15.5771L15.5596 2.15366C16.0314 1.68188 16.0349 0.867046 15.5472 0.385955C15.0594-0.101795 14.2544-0.111561 13.7728 0.373534ZM15.5596 13.7939L2.13613 0.370428C1.67677-0.0924792 0.839748-0.111561 0.358657 0.38285C-0.119328 0.870601-0.110012 1.6912 0.349341 2.15055L13.7728 15.574C14.2446 16.0458 15.0661 16.0494 15.5472 15.5647C16.0283 15.077 16.0314 14.2688 15.5596 13.7939Z"
                />
              </g>
            </svg>`;

    function submitNewPost() {
        if (newPostInput.value.trim() === "") {
            alert("Your post cannot be empty");
            return;
        }

        fetch("/api/project4/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: newPostInput.value }),
        })
            .then(response => response.json())
            .then(data => {
                const newPost = document.createElement("div");
                newPost.classList.add("post");
                newPost.id = "post-" + data.post.id;
                const newPostContent = document.createElement("div");
                newPostContent.classList.add("post-content");
                newPostContent.textContent = data.post.content;
                const newPostTimestamp = document.createElement("div");
                newPostTimestamp.classList.add("post-timestamp");
                newPostTimestamp.textContent = (new Date(data.post.createdAt)).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                const newDeleteButton = document.createElement("button");
                newDeleteButton.classList.add("delete-button");
                newDeleteButton.innerHTML = deleteButtonIcon;
                newDeleteButton.addEventListener("click", () => {
                    deletePost(data.post.id);
                });
                newPostTimestamp.appendChild(newDeleteButton);
                newPost.appendChild(newPostContent);
                newPost.appendChild(newPostTimestamp);
                posts.appendChild(newPost);
                newPostInput.value = "";
            })
            .catch(() => {
                alert("Failed to submit new post");
            });
    }

    submitButton.addEventListener("click", () => {
        submitNewPost();
    });

    newPostInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            submitNewPost();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (document.activeElement !== newPostInput) {
            newPostInput.focus();
        }
    });
};