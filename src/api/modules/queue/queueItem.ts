import BaseCrudApi from "@/api/baseCrud";
import { QueueItemDto } from "@/models";

export default class QueueItemApi extends BaseCrudApi<QueueItemDto> {
  protected baseRoute = "queue-item";
}
