import type { NodeCG } from "nodecg-types/types/server";
export default (nodecg: NodeCG) => {
  nodecg.log.info("⬆ Setting up 'web' extension...");

  const router = nodecg.Router();

  router.get("/events/:event", (req, res) => {
    const event = req.params.event;
    nodecg.log.debug(`Received Event: ${event}`);
    nodecg.sendMessage(event);
    res.send("OK");
  });

  nodecg.mount("/", router);
};
