fetch("/api/health")
  .then(r => r.json())
  .then(d => console.log(d));